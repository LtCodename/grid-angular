import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, mergeMap } from "rxjs/operators";
import { IDriver } from './drivers-model';
import { AngularFirestore } from "@angular/fire/firestore";
import { TeamsService } from '../teams/teams.service';
import { ITeam } from '../teams/teams-model';

@Injectable({
  providedIn: 'root'
})
export class DriversService {

  drivers$: Observable<IDriver[]>;

  private driversSubject: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private firestore: AngularFirestore, private teamsService: TeamsService) { 
    this.drivers$ = this.driversSubject.asObservable();

    this.getDrivers().subscribe(data => {
      this.driversSubject.next(data);
    });
  }

  private getDrivers() {
    return this.firestore.collection('drivers')
      .snapshotChanges()
      .pipe(map(this.processSnapshot));
  }

  getDriversData() {
    return this.drivers$.pipe(
      mergeMap((driversData) => this.teamsService.teams$.pipe(map((teamsData: ITeam[]): [IDriver[], ITeam[]] => [driversData, teamsData]))),
      map(([driversData, teamsData]) => {
        driversData.forEach((driver: IDriver) => {
          const teamData: ITeam[] = teamsData.filter((team: ITeam) => team.id === driver['team-id']);
          driver.color = teamData[0] ? teamData[0].color : "";
          driver.teamName = teamData[0] ? teamData[0].name : "";
          driver.url = `/drivers/${driver.id}`;
        });
        return driversData;
      })
    );
  }

  private processSnapshot(data) {
    return data.map((e) => ({
      id: e.payload.doc.id,
      ...e.payload.doc.data()
    }));
  }
}
