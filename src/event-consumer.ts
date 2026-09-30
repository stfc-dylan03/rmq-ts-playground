import amqp from "amqplib";

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

            const event = JSON.parse(eventJson);
            console.log("Parsed Event: ", event);

            console.log(event.eventType);
            console.log(event.proposalId);

            if (event.eventType === "RISK_ASSESSMENT_REQUIRED") {
                console.log("Creating risk assessment for proposal: ", event.proposalId);
            }

            channel.ack(message);
        }
    });
}

consumeEvents().catch(console.error);