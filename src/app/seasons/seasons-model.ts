export interface ISeason {
    id: string;
    current: boolean;
    name: string;
    deductedPoints: IDeductedPoints;
    drivers: string[];
    teams: any[];
}

export interface IDeductedPoints {
    [id:string]: string;
}