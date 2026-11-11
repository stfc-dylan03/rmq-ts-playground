import amqp from "amqplib";
import type { ProposalBookingTimeSlotAddedMessage, ExperimentCreatedMessage } from "../shared/events.js";

interface BookingEvent {
    type: "PROPOSAL_BOOKING_TIME_SLOT_ADDED";
    message: ProposalBookingTimeSlotAddedMessage;
}

function isBookingEvent(value: unknown): value is BookingEvent {
    if (typeof value !== "object" || value === null) {
        return false;
    }

    if (!("type" in value) || value.type !== "PROPOSAL_BOOKING_TIME_SLOT_ADDED") {
        return false;
    }

    if (!("message" in value)) {
        return false
    }

    const booking = value.message;

    if (typeof booking !== "object" || booking === null) {
        return false;
    }

    return (
        "id" in booking && typeof booking.id === "number" &&
        "bookingType" in booking && typeof booking.bookingType === "string" &&
        "startsAt" in booking && typeof booking.startsAt === "string" &&
        "endsAt" in booking && typeof booking.endsAt === "string" &&
        "proposalBookingId" in booking && typeof booking.proposalBookingId === "number" &&
        "status" in booking && typeof booking.status === "string" &&
        "proposalPk" in booking && typeof booking.proposalPk === "number" &&
        "localContactId" in booking && (booking.localContactId === null || typeof booking.localContactId === "number") &&
        "instrumentId" in booking && typeof booking.instrumentId === "number"
    );
}

async function consumeBookingEvents() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const incomingExchange = "user_office_scheduler_backend.fanout";
    const outgoingExchange = "user_office_backend.fanout";
    const queue = "user_office_backend.queue";

    await channel.assertExchange(incomingExchange, "fanout", {
        durable: true
    });

    await channel.assertExchange(outgoingExchange, "fanout", {
        durable: true
    });

    await channel.assertQueue(queue, {
        durable: true
    });

    await channel.bindQueue(queue, incomingExchange, "");

    let nextExperimentPk = 1;

    console.log("UO Backend: Waiting for booking events...");

    channel.consume(queue, (msg) => {
        if (!msg) return;

        let event: unknown;

        try {
            event = JSON.parse(msg.content.toString());
        } catch {
            console.error("UO Backend: Invalid JSON");
            channel.ack(msg);
            return;
        }

        if (!isBookingEvent(event)) {
            console.error("UO Backend: Invalid booking event");
            channel.ack(msg);
            return;
        }

        const booking = event.message;

        console.log("UO Backend: Booking received: ", booking);

        const experiment = {
            experimentId: `SIM-${booking.proposalPk}-${booking.id}`,
            experimentPk: nextExperimentPk++,
            startsAt: booking.startsAt,
            endsAt: booking.endsAt,
            scheduledEventId: booking.id,
            proposalPk: booking.proposalPk,
            status: booking.status,
            localContactId: booking.localContactId,
            instrumentId: booking.instrumentId
        };

        console.log("UO Backend: Experiment created: ", experiment);

        const experimentMessage: ExperimentCreatedMessage = {
            experimentId: experiment.experimentId,
            experimentPk: experiment.experimentPk,
            startsAt: experiment.startsAt,
            endsAt: experiment.endsAt,
            status: experiment.status,
            samples: [],
            instrument: {
                id: experiment.instrumentId,
                name: "Mock Instrument",
                shortCode: "E01"
            }
        };

        const createdEvent = {
            type: "EXPERIMENT_CREATED",
            message: experimentMessage
        };

        channel.publish(outgoingExchange, "", Buffer.from(JSON.stringify(createdEvent)));

        console.log("UO Backend: Published EXPERIMENT_CREATED");
        console.log("Published payload: ", createdEvent);

        channel.ack(msg);
    })
}

consumeBookingEvents().catch(console.error);