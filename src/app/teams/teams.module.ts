import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsPageComponent } from './teams-page/teams-page.component';
import { TeamsRoutingModule } from './teams-routing.module';



@NgModule({
  declarations: [TeamsPageComponent],
  imports: [
    CommonModule,
    TeamsRoutingModule
  ]
})
export class TeamsModule { }
