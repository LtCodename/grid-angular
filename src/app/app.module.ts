import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { DriverModule } from './components/driver/driver.component';

const firebaseConfig = {
  apiKey: "AIzaSyBySqoOBscXNukfZu9wLROMXHEBASoMEjI",
  authDomain: "f1-grid.firebaseapp.com",
  databaseURL: "https://f1-grid.firebaseio.com",
  projectId: "f1-grid",
  storageBucket: "f1-grid.appspot.com",
  messagingSenderId: "89884829800",
  appId: "1:89884829800:web:e7738c3f728e60ab4ff3dd",
  measurementId: "G-F1QZPP33ZP"
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    AngularFireStorageModule,
    DriverModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
