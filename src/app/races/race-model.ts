export interface IRace {
    id: string;
    date: string;
    lap: string;
    location: string;
    name: string;
    places: any;
    pole: string;
    round: string;
    finished: boolean;
    url: string;
    "season-id": string;
    "name-full": string;
    "lap-team": string;
}

export interface IPlace {
    driver: string;
    team: string;
}


