export interface ISummary {
    type: string;
    text?: string;
    team?: string;
    year?: string;
    years?: any[];
    from?: string;
    to?: string;
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