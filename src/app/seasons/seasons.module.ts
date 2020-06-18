import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonsPageComponent } from './seasons-page/seasons-page.component';
import { SeasonsRoutingModule } from './seasons-routing.module';
import { RaceModule } from '../components/race/race.component';



@NgModule({
  declarations: [SeasonsPageComponent],
  imports: [
    CommonModule,
    SeasonsRoutingModule,
    RaceModule
  ]
})
export class SeasonsModule { }
