import amqp from "amqplib";
import type { ProposalBookingTimeSlotAddedMessage } from "../shared/events.js";

async function scheduleExperiment() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "user_office_scheduler_backend.fanout";

    await channel.assertExchange(exchange, "fanout", {
        durable: true
    });

    const booking: ProposalBookingTimeSlotAddedMessage = {
        id: 200,
        bookingType: "USER_OPERATIONS",
        startsAt: "2027-06-10 09:00:00",
        endsAt: "2027-06-11 09:00:00",
        proposalBookingId: 2222,
        status: "ACTIVE",
        proposalPk: 8,
        localContactId: null,
        instrumentId: 2
    };

    const event = {
        type: "PROPOSAL_BOOKING_TIME_SLOT_ADDED",
        message: booking
    };

    channel.publish(
        exchange, "", Buffer.from(JSON.stringify(event))
    );

    console.log("STFC Scheduler: Experiment scheduled");
    console.log("Published event: ", event);

    await channel.close();
    await connection.close();
}

scheduleExperiment().catch(console.error);