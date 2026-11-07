import amqp from "amqplib";
import { isDraftEvent } from "../events/validation.js";

async function consumeEvents() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "draft.topic";
    const queue = "risk.topic.queue";
    const bindingKey = "risk.assessment.*";

    await channel.assertExchange(exchange, "topic", {
        durable: true
    });

    await channel.assertQueue(queue, {
        durable: true
    });

    await channel.bindQueue(queue, exchange, bindingKey);

    console.log("Waiting for events in queue: ", queue);

    channel.consume(queue, (message) => {
        if (!message) return;

        let event: unknown;

        try {
            event = JSON.parse(message.content.toString());
        } catch {
            console.error("Invalid JSON");
            channel.ack(message);
            return;
        }

        if (!isDraftEvent(event)) {
            console.error("Invalid Draft event");
            channel.ack(message);
            return;
        }

        if (event.eventType === "RISK_ASSESSMENT_REQUIRED") {
            console.log("Risk assessment required for proposal: ", event.proposalId);
        }

        channel.ack(message);
    });
}

consumeEvents().catch(console.error);