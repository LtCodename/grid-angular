import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  authToken$: Observable<any>;

  private tokenSubject: BehaviorSubject<any> = new BehaviorSubject(null);

  constructor(public fireAuth: AngularFireAuth) {
    this.authToken$ = this.tokenSubject.asObservable();

    this.fireAuth.onAuthStateChanged(user => {
      this.tokenSubject.next(user);
    })
  }

  loginUser(email: string, password: string) {
    return this.fireAuth.signInWithEmailAndPassword(email, password);
  }

  logoutUser() {
    return this.fireAuth.signOut();
  }
}
