import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { ISeason } from './seasons-model';
import { map } from 'rxjs/operators';
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class SeasonsService {

  seasons$: Observable<ISeason[]>;

  private seasonsSubject: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private firestore: AngularFirestore) {
    this.seasons$ = this.seasonsSubject.asObservable();

    this.getSeasons().subscribe(data => {
      this.seasonsSubject.next(data);
    });
  }

  private getSeasons() {
    return this.firestore.collection('seasons')
      .snapshotChanges()
      .pipe(map(this.processSnapshot));
  }

  edit(data: any) {
    return this.firestore.collection('seasons').doc(data.id).update({ ...data });
  }

  add(data: any) {
    return this.firestore.collection('seasons').add({ ...data });
  }

  private processSnapshot(data) {
    return data.map((e) => ({
      id: e.payload.doc.id,
      ...e.payload.doc.data()
    }));
  }
}
