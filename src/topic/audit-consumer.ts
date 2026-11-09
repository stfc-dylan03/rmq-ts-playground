import amqp from "amqplib";

async function consumeAuditEvents() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "draft.topic";
    const queue = "audit.queue";
    const bindingKey = "#";

    await channel.assertExchange(exchange, "topic", {
        durable: true
    });

    await channel.assertQueue(queue, {
        durable: true
    });

    await channel.bindQueue(queue, exchange, bindingKey);

    console.log("Waiting for audit events in queue: ", queue);

    channel.consume(queue, (message) => {
        if (!message) return;

        console.log("Audit event received:");
        console.log("Routing key: ", message.fields.routingKey);
        console.log("Payload: ", message.content.toString());

        channel.ack(message);
    });
}

consumeAuditEvents().catch(console.error);