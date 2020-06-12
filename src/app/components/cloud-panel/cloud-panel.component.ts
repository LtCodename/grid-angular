import { Component, OnInit, Input } from '@angular/core';
import { IDriver } from 'src/app/drivers/drivers-model';
import { Subject } from 'rxjs';
import { DriversService } from 'src/app/drivers/drivers.service';
import { takeUntil } from 'rxjs/operators';
import { SeasonsService } from 'src/app/seasons/seasons.service';
import { ISeason } from 'src/app/seasons/seasons-model';
import { ITeam } from 'src/app/teams/teams-model';
import { TeamsService } from 'src/app/teams/teams.service';

@Component({
  selector: 'app-cloud-panel',
  templateUrl: './cloud-panel.component.html',
  styleUrls: ['./cloud-panel.component.scss']
})
export class CloudPanelComponent implements OnInit {

  @Input() mode: string = "";

  drivers: IDriver[] = [];
  teams: ITeam[] = [];
  seasons: ISeason[] = [];
  driversToDisplay: IDriver[] = [];
  teamsToDisplay: ITeam[] = [];
  showDriversPanel: boolean = false;
  showTeamsPanel: boolean = false;

  private notifier = new Subject();

  constructor(
      private driversService: DriversService, 
      private seasonsService: SeasonsService,
      private teamsService: TeamsService
    ) {
  }

  prepareTeams(): void {
    //Get teams
    this.teamsService.teams$.subscribe(data => {
      this.teams = data;

      //Only include current season teams
      this.seasonsService.seasons$.subscribe(data => {
        this.seasons = data;
        const currentSeason = this.seasons.find((season: ISeason) => season.current);
        const currentSeasonTeams = currentSeason ? currentSeason.teams : [];

        this.teamsToDisplay = [];
        if (currentSeasonTeams) {
          currentSeasonTeams.forEach((teamId: string) => {
            const foundTeam: ITeam = this.teams.find((team: ITeam) => team.id === teamId);
            if (foundTeam) {
              this.teamsToDisplay.push(foundTeam);
            }

            //Sort teams by name
            this.teamsToDisplay.sort((a: ITeam, b: ITeam) => {
              if (a.name < b.name) {
                return -1;
              }
              if (a.name > b.name) {
                return 1;
              }
              return 0;
            })
          })
        }
        
        if(this.teamsToDisplay.length) {
          this.showTeamsPanel = true;
        }
      });
    });
  }

  prepareDrivers(): void {
    // Get drivers
    this.driversService.getDriversData().pipe(takeUntil(this.notifier)).subscribe((driversData: IDriver[]) => {
      this.drivers = driversData;
      //Only include current season drivers
      this.seasonsService.seasons$.subscribe(data => {
        this.seasons = data;
        const currentSeason = this.seasons.find((season: ISeason) => season.current);
        const currentSeasonDrivers = currentSeason ? currentSeason.drivers : [];

        this.driversToDisplay = [];
        if (currentSeasonDrivers) {
          currentSeasonDrivers.forEach((driverId: string) => {
            const foundDriver: IDriver = this.drivers.find((driver: IDriver) => driver.id === driverId);
            if (foundDriver) {
              this.driversToDisplay.push(foundDriver);
            }

            //Sort drivers by team name
            this.driversToDisplay.sort((a: IDriver, b: IDriver) => {
              if (a.teamName < b.teamName) {
                return -1;
              }
              if (a.teamName > b.teamName) {
                return 1;
              }
              return 0;
            });
          });
        }
        
        if(this.driversToDisplay.length) {
          this.showDriversPanel = true;
        }
      });
    }, () => {
    });
  }

  ngOnInit(): void {
    if (this.mode === "drivers") {
      this.prepareDrivers();
    } else if (this.mode === "teams") {
      this.prepareTeams();
    }
  }
}
