export interface RiskAssessmentRequiredEvent {
    eventType: "RISK_ASSESSMENT_REQUIRED";
    proposalId: number;
}

export interface DraftCompletedEvent {
    eventType: "DRAFT_COMPLETED";
    proposalId: number;
}

export type DraftEvent =
    | RiskAssessmentRequiredEvent
    | DraftCompletedEvent;