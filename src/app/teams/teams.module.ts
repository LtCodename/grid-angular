import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsPageComponent } from './teams-page/teams-page.component';
import { TeamsRoutingModule } from './teams-routing.module';
import { TeamModule } from '../components/team/team.component';



@NgModule({
  declarations: [TeamsPageComponent],
  imports: [
    CommonModule,
    TeamsRoutingModule,
    TeamModule
  ]
})
export class TeamsModule { }
