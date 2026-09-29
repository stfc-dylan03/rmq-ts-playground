import amqp from "amqplib";

async function produce() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel(); //only need one channel for small application

    const queue = "hello";

    await channel.assertQueue(queue, {
        durable: true
    });

    const message = "Hello RabbitMQ";

    channel.sendToQueue(queue, Buffer.from(message));

    console.log(`Sent: ${message}`);

    //Close connection
    await channel.close();
    await connection.close();
}

produce().catch(console.error);