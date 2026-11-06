import amqp from 'amqplib';
import {isDraftEvent} from "../events/validation.js";

async function consumeEvents() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "draft.exchange";
    const queue = "rist-assessment.queue";
    const routingKey = "risk.assessment.required";

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

        const eventJson = message.content.toString();

        let event: unknown;

        try { 
            event = JSON.parse(eventJson);
        } catch {
            console.error("Message is not valid JSON: ", eventJson);
            channel.ack(message);
            return;
        }

        if (!isDraftEvent(event)) {
            console.error("Invalid Draft event received: ", event);
            channel.ack(message);
            return;
        }

        if (event.eventType === "RISK_ASSESSMENT_REQUIRED") {
            console.log("Creating risk assessment for proposal: ", event.proposalId);
        }

        channel.ack(message);
    });
}

consumeEvents().catch(console.error);