import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TeamsPageComponent } from './teams-page/teams-page.component';
import { TeamsRoutingModule } from './teams-routing.module';
import { TeamModule } from '../components/team/team.component';
import { TeamPageComponent } from './team-page/team-page.component';



@NgModule({
  declarations: [TeamsPageComponent, TeamPageComponent],
  imports: [
    CommonModule,
    TeamsRoutingModule,
    TeamModule
  ]
})
export class TeamsModule { }
