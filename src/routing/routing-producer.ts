import amqp from "amqplib";
import type { DraftEvent } from "../events/types.js";

async function produceEvent() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "draft.exchange";

    await channel.assertExchange(exchange, "direct", {
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

    const routingKey = "risk.assessment.required";

    channel.publish(
        exchange,
        routingKey,
        Buffer.from(JSON.stringify(event))
    );

    console.log("Published event: ", event);
    console.log("Routing key: ", routingKey);

    await channel.close();
    await connection.close();

}

produceEvent().catch(console.error);