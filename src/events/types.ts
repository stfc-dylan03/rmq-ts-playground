export interface BaseEvent {
    eventId: string;
    eventVersion: number;
    timestamp: string;
    source: string;
}

export interface RiskAssessmentRequiredEvent extends BaseEvent {
    eventType: "RISK_ASSESSMENT_REQUIRED";
    proposalId: number;
}

export interface DraftCompletedEvent extends BaseEvent {
    eventType: "DRAFT_COMPLETED";
    proposalId: number;
}

export type DraftEvent =
    | RiskAssessmentRequiredEvent
    | DraftCompletedEvent;