import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { IRace } from './race-model';
import { AngularFirestore } from "@angular/fire/firestore";
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RacesService {

  races$: Observable<IRace[]>;

  private racesSubject: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private firestore: AngularFirestore) {
    this.races$ = this.racesSubject.asObservable();

    this.getRaces().subscribe(data => {
      this.racesSubject.next(data);
    });
  }

  private getRaces() {
    return this.firestore.collection('races')
      .snapshotChanges()
      .pipe(map(this.processSnapshot));
  }

  edit(data: any) {
    return this.firestore.collection('races').doc(data.id).update({ ...data });
  }

  add(data: any) {
    return this.firestore.collection('races').add({ ...data });
  }

  private processSnapshot(data) {
    return data.map((e) => ({
      id: e.payload.doc.id,
      url: `/race/${e.payload.doc.id}`,
      ...e.payload.doc.data()
    }));
  }
}
