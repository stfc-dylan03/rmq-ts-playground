import amqp from "amqplib";
import type { DraftEvent } from "../events/types.js";

function getRoutingKey(event: DraftEvent): string {
    switch (event.eventType) {
        case "RISK_ASSESSMENT_REQUIRED":
            return "risk.assessment.required";
        case "DRAFT_COMPLETED":
            return "draft.completed";
    }
}

async function produceEvent() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "draft.topic";

    await channel.assertExchange(exchange, "topic", {
        durable: true
    });

    const event: DraftEvent = {
        eventId: crypto.randomUUID(),
        eventType: "RISK_ASSESSMENT_REQUIRED",
        eventVersion: 1,
        timestamp: new Date().toISOString(),
        source: "draft",
        proposalId: 12345
    };

    const routingKey = getRoutingKey(event);

    channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(event)));

    console.log("Published event: ", event);
    console.log("Routing key: ", routingKey);

    await channel.close();
    await connection.close();
}

produceEvent().catch(console.error);