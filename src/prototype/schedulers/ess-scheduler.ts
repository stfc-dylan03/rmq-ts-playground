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
        id: 100,
        bookingType: "USER_OPERATIONS",
        startsAt: new Date().toISOString(),
        endsAt: new Date(Date.now() + 3600000).toISOString(),
        proposalBookingId: 1111,
        status: "ACTIVE",
        proposalPk: 4,
        localContactId: 100,
        instrumentId: 1
    };

    const event = {
        type: "PROPOSAL_BOOKING_TIME_SLOT_ADDED",
        message: booking
    };

    channel.publish(exchange, "", Buffer.from(JSON.stringify(event)));

    console.log("ESS Scheduler: Experiment scheduled");
    console.log("Published event: ", event);

    await channel.close();
    await connection.close();
}

scheduleExperiment().catch(console.error);