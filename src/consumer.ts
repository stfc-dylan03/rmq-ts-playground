import amqp from "amqplib";

async function consume() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const queue = "hello";

    await channel.assertQueue(queue, {
        durable: true
    });

    //Listening
    console.log("Waiting for messages in queue: ", queue);

    channel.consume(queue, (message) => {
        if(message){
            const content = message.content.toString();

            console.log("Received: ", content);

            channel.ack(message);
        }
    });
}

consume().catch(console.error);