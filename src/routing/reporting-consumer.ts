import amqp from "amqplib";
import { isDraftEvent } from "../events/validation.js";

async function consumeReportingEvents() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "draft.exchange";
    const queue = "reporting.queue";
    const routingKey = "draft.completed";

    await channel.assertExchange(exchange, "direct", {
        durable: true
    });

    await channel.assertQueue(queue, {
        durable: true
    });

    await channel.bindQueue(queue, exchange, routingKey);

    console.log("Waiting for messages in queue: ", queue);

    channel.consume(queue, (message) => {
        if (!message) return;

        let event: unknown;

        try {
            event = JSON.parse(message.content.toString());
        } catch {
            console.error("Message is not valid JSON");
            channel.ack(message);
            return;
        }

        if (!isDraftEvent(event)) {
            console.error("Invalid Draft event: ", event);
            channel.ack(message);
            return;
        }

        if (event.eventType === "DRAFT_COMPLETED"){
            console.log("Generating report for proposal: ", event.proposalId);
        }

        channel.ack(message);
    });
}

consumeReportingEvents().catch(console.error);