import type { DraftEvent } from "./types.js";

export function isDraftEvent(event: unknown): event is DraftEvent {
    if (typeof event !== "object" || event === null)
    {
        return false;
    }

    if (!("eventType" in event)) {
        return false;
    }

    if (
        event.eventType !== "RISK_ASSESSMENT_REQUIRED" &&
        event.eventType !== "DRAFT_COMPLETED"
    ) {
        return false;
    }

    if (!("proposalId" in event) || typeof event.proposalId !== "number") {
        return false;
    }

    if (!("eventId" in event) || typeof event.eventId !== "string") {
        return false;
    }

    if (!("eventVersion" in event) || typeof event.eventVersion !== "number") {
        return false;
    }

    if (!("timestamp" in event) || typeof event.timestamp !== "string") {
        return false;
    }

    if (!("source" in event) || typeof event.source !== "string") {
        return false;
    }
    

    return true;
}