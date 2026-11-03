import amqp from 'amqplib';

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

    console.log("Queue created and bound to exchange");
    console.log("Queue: ", queue);
    console.log("Routing Key: ", routingKey);
}

consumeEvents().catch(console.error);