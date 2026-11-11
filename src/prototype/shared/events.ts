export interface ProposalBookingTimeSlotAddedMessage {
    id: number;
    bookingType: string;
    startsAt: string;
    endsAt: string;
    proposalBookingId: number;
    status: string;
    proposalPk: number;
    localContactId: number | null;
    instrumentId: number;
}

export interface ExperimentCreatedMessage {
    experimentId: string;
    experimentPk: number;
    startsAt: string;
    endAt: string;
    status: string;

    proposal?: unknown;

    samples: {
        id: number;
        title: string;
    }[];

    instrument?: {
        id: number;
        name: string;
        shortCode: string;
    }
}