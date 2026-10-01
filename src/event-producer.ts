import amqp from "amqplib";
import type { DraftEvent } from "./events/types.js";

async function produceEvent() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel(); //only need one channel for small application

    const queue = "draft-events";

    await channel.assertQueue(queue, {
        durable: true
    });


    //Event
    const event: DraftEvent  = {
        eventId: crypto.randomUUID(),
        eventType: "RISK_ASSESSMENT_REQUIRED",
        eventVersion: 1,
        timestamp: new Date().toISOString(),
        source: "draft",
        proposalId: 12345
    };

    const eventJson = JSON.stringify(event);

    channel.sendToQueue(queue, Buffer.from(eventJson));

    console.log("Event sent: ", event);



    //Close connection
    await channel.close();
    await connection.close();
}

produceEvent().catch(console.error);

//run npx tsx src/event-producer.ts