export interface ExperimentCreatedMessage {
    experimetnId: string;
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