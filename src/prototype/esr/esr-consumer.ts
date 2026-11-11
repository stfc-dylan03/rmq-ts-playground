import amqp from "amqplib";
import { isExperimentCreatedMessage } from "../shared/validation.js";

async function consumeExperimentEvents() {
    const connection = await amqp.connect("amqp://localhost");
    const channel = await connection.createChannel();

    const exchange = "user_office_backend.fanout";
    const queue = "esr.experiment-created.queue";

    await channel.assertExchange(exchange, "fanout", {
        durable: true
    });

    await channel.assertQueue(queue, {
        durable: true
    });

    await channel.bindQueue(queue, exchange, "");

    console.log("ESR: Waiting for experiment events...");

    channel.consume(queue, (msg) => {
        if (!msg) return;

        let event: unknown;

        try {
            event = JSON.parse(msg.content.toString());
        } catch {
            console.error("ESR: Invalid JSON");
            channel.ack(msg);
            return;
        }

        if (typeof event !== "object" || event === null || !("type" in event) || typeof event.type !== "string" || !("message" in event)) {
            console.error("ESR: Invalid event structure");
            channel.ack(msg);
            return;
        }

        if (event.type !== "EXPERIMENT_CREATED") {
            console.log("ESR: Ignoring event " + event.type);
            channel.ack(msg);
            return;
        }

        if (!isExperimentCreatedMessage(event.message)) {
            console.error("ESR: Invalid experiment data");
            channel.ack(msg);
            return;
        }

        const experiment = event.message;

        console.log("ESR: Valid EXPERIMENT_CREATED event received");

        console.log("Experiment ID:", experiment.experimentId);
        console.log("Experiment status:", experiment.status);
        console.log("Start time:", experiment.startsAt);
        console.log("End time:", experiment.endsAt);

        if (experiment.instrument) {
            console.log("Instrument: ", experiment.instrument.shortCode);
        }

        console.log("ESR: Checking whether an ESR is required for ", experiment.experimentId);

        channel.ack(msg);
    });
}

consumeExperimentEvents().catch(console.error);