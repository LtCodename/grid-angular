interface ISummary {
    type: string;
}

export interface IDriver {
    championships: string;
    debut: string;
    name: string;
    nationality: string;
    number: string;
    podiums: string;
    poles: string;
    wins: string;
    id: string;
    color: string;
    teamName: string;
    url: string;
    summary: ISummary[]
    'date-of-birth': string;
    'team-id': string;
}