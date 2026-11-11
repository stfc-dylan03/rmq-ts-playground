import type { ExperimentCreatedMessage} from "./events.js";

function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function isExperimentCreatedMessage(value: unknown): value is ExperimentCreatedMessage {
    if (!isObject(value)) {
        return false;
    }

    if (typeof value.experimentId !== "string") {
        return false;
    }
    if (typeof value.experimentPk !== "number") {
        return false;
    }
    if (typeof value.startsAt !== "string") {
        return false;
    }
    if (typeof value.endsAt !== "string") {
        return false;
    }
    if (typeof value.status !== "string") {
        return false;
    }

    if (!Array.isArray(value.samples)) {
        return false;
    }

    for (const sample of value.samples) {
        if (!isObject(sample) || typeof sample.id !== "number" || typeof sample.title !== "string") {
            return false;
        }
    }

    if (value.instrumnt !== undefined) {
        const instrument = value.instrument;

        if (!isObject(instrument) || typeof instrument.id !== "number" || typeof instrument.name !== "string" || typeof instrument.shortCode !== "string") {
            return false;
        }
    }
    return true;
}