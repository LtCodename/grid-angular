import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeasonsPageComponent } from './seasons-page/seasons-page.component';
import { SeasonsRoutingModule } from './seasons-routing.module';



@NgModule({
  declarations: [SeasonsPageComponent],
  imports: [
    CommonModule,
    SeasonsRoutingModule
  ]
})
export class SeasonsModule { }
