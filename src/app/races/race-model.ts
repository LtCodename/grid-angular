export interface IRace {
    id: string;
    date: string;
    realDate: any;
    lap: string;
    location: string;
    name: string;
    places: any;
    pole: string;
    round: string;
    fullName: string;
    circuit: string;
    finished: any;
    ongoing: boolean;
    url: string;
    "season-id": string;
    "name-full": string;
    "lap-team": string;
}

export interface IPlace {
    driver: string;
    team: string;
}

export interface IRaceResult {
    driver: string;
    team: string;
    points: number;
    place: number;
}


