import { Component, OnInit } from '@angular/core';
import { DriversService } from '../drivers.service';
import { IDriver } from '../drivers-model';
import { takeUntil, mergeMap, map } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TeamsService } from 'src/app/teams/teams.service';
import { ITeam } from 'src/app/teams/teams-model';

@Component({
  selector: 'app-drivers-page',
  templateUrl: './drivers-page.component.html',
  styleUrls: ['./drivers-page.component.scss']
})
export class DriversPageComponent implements OnInit {

  drivers: IDriver[] = [];
  showPreloader: boolean = true;

  private notifier = new Subject();

  constructor(private driversService: DriversService, private teamsService: TeamsService) {
    this.driversService.drivers$.pipe(
      takeUntil(this.notifier),
      mergeMap((driversData) => this.teamsService.teams$.pipe(map((teamsData: any) => [driversData, teamsData])))
    ).subscribe(([driversData, teamsData]) => {
      driversData.forEach((driver: any) => {
        const teamData: ITeam = teamsData.filter(team => team.id === driver['team-id']);
        driver.color = teamData[0] ? teamData[0].color : "";
      });

      this.drivers = driversData;
      if(this.drivers.length) {
        this.showPreloader = false;
      }
    }, () => {
      this.showPreloader = false;
    });
  }

  ngOnInit(): void {
  }

}
