import amqp from "amqplib";
import { isDraftEvent } from "./events/validation.js";

async function consumeEvents() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "draft-events";

    await channel.assertQueue(queue, {
        durable: true
    });

    console.log("Waiting for events in queue: ", queue);

    //Consume here
    channel.consume(queue, (message) => {
        if (message){
            const eventJson = message.content.toString();

            console.log("Received JSON: ", eventJson);

            let event: unknown;

            try
            {
                event = JSON.parse(eventJson);
            } catch {
                console.error("Message is not JSON");

                channel.ack(message);
                return;
            }

            console.log("Parsed Event: ", event);

            if (!isDraftEvent(event)) {
                console.error("Invalid Draft event");
                channel.ack(message);
                return;
            }

            console.log("Valid event type: ", event.eventType);
            console.log("Proposal ID: ", event.proposalId);
        }
    });
}

consumeEvents().catch(console.error);

// run npx tsx src/event-consumer.ts