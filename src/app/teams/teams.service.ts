import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ITeam } from './teams-model';
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TeamsService {

  teams$: Observable<ITeam[]>;

  private teamsSubject: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private firestore: AngularFirestore) {
    this.teams$ = this.teamsSubject.asObservable();

    this.getTeams().subscribe(data => {
      this.teamsSubject.next(data);
    });
  }

  private getTeams() {
    return this.firestore.collection('teams')
      .snapshotChanges()
      .pipe(map(this.processSnapshot));
  }

  private processSnapshot(data) {
    return data.map((e) => ({
      id: e.payload.doc.id,
      ...e.payload.doc.data()
    }));
  }
}
