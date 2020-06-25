import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RacePageComponent } from './race-page/race-page.component';
import { RacesRoutingModule } from './races-routing.module';



@NgModule({
  declarations: [RacePageComponent],
  imports: [
    CommonModule,
    RacesRoutingModule
  ]
})
export class RacesModule { }
