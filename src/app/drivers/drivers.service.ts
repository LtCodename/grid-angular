import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { map } from "rxjs/operators";
import { IDriver } from './drivers-model';
import { AngularFirestore } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class DriversService {

  drivers$: Observable<IDriver[]>;

  private driversSubject: BehaviorSubject<any> = new BehaviorSubject([]);

  constructor(private firestore: AngularFirestore) { 
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

  private processSnapshot(data) {
    return data.map((e) => ({
      id: e.payload.doc.id,
      ...e.payload.doc.data()
    }));
  }
}
