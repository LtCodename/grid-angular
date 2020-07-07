import { Component, OnInit, NgZone} from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { filter, mergeMap, map } from 'rxjs/operators';
import { SeasonsService } from 'src/app/seasons/seasons.service';
import { RacesService } from 'src/app/races/races.service';
import { DriversService } from 'src/app/drivers/drivers.service';
import { TeamsService } from 'src/app/teams/teams.service';
import { ISeason } from 'src/app/seasons/seasons-model';
import { IRace } from 'src/app/races/race-model';
import { IDriver } from 'src/app/drivers/drivers-model';
import { ITeam } from 'src/app/teams/teams-model';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss'],
})
export class DashboardPageComponent implements OnInit {

  email: string = "";
  password: string = "";
  user: any = undefined;
  showLoginPanel: boolean = false;
  showEditPanel: boolean = false;
  loginButtonText: string = "Login";
  logoutButtonText: string = "Logout";
  editMode: string = "";
  showData: boolean = false;

  selectedDriver: IDriver = null
  selectedTeam: ITeam = null

  allSeasons: ISeason[] = [];
  allRaces: IRace[] = [];
  allTeams: ITeam[] = [];
  allDrivers: IDriver[] = [];

  constructor(
      private dashboardService: DashboardService, 
      private ngZone: NgZone,
      private seasonsService: SeasonsService,
      private racesService: RacesService,
      private driversService: DriversService,
      private teamsService: TeamsService,
    ) {
    this.dashboardService.authToken$.pipe(filter((data) => data !== 'first')).subscribe(data => {
      this.ngZone.run(() => {
        this.user = data;
        if (this.user) {
          this.showLoginPanel = false;
          this.showEditPanel = true;
        } else {
          this.showLoginPanel = true;
          this.showEditPanel = false;
        }
        //console.log(this.user);
      });
    });

    this.seasonsService.seasons$.pipe(
      mergeMap((allSeasons: ISeason[]) => this.racesService.races$.pipe(map((allRaces: IRace[]): [ISeason[], IRace[]] => [allSeasons, allRaces]))),
      mergeMap(([allSeasons, allRaces]) => this.driversService.drivers$.pipe(map((allDrivers: IDriver[]): [ISeason[], IRace[], IDriver[]] => [allSeasons, allRaces, allDrivers]))),
      mergeMap(([allSeasons, allRaces, allDrivers]) => this.teamsService.teams$.pipe(map((allTeams: ITeam[]): [ISeason[], IRace[], IDriver[], ITeam[]] => [allSeasons, allRaces, allDrivers, allTeams])))
    ).subscribe(([allSeasons, allRaces, allDrivers, allTeams]) => {
      if (allSeasons.length && allRaces.length && allDrivers.length && allTeams.length) {
        this.allSeasons = allSeasons.sort((a: ISeason, b: ISeason) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        this.allDrivers = allDrivers.sort((a: IDriver, b: IDriver) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        this.allTeams = allTeams.sort((a: ITeam, b: ITeam) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        this.allRaces = allRaces.sort((a: IRace, b: IRace) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
      }

      this.showData = true;
    }, () => {
      this.showData = true;
    });
  }

  ngOnInit(): void {
  }

  login(): void {
    this.loginButtonText = "Wait...";
    this.dashboardService.loginUser(this.email, this.password).then(res => {
      console.log(res);
      this.loginButtonText = "Done";
      setTimeout(() => {
        this.loginButtonText = "Login";
      }, 1000);
    }).catch(error => {
      console.log(error);
      this.loginButtonText = "Error!";
      setTimeout(() => {
        this.loginButtonText = "Login";
      }, 2000);
    })
  }

  logout(): void {
    this.logoutButtonText = "Wait...";
    this.dashboardService.logoutUser().then(res => {
      console.log(res);
      this.logoutButtonText = "Done";
      setTimeout(() => {
        this.logoutButtonText = "Logout";
      }, 1000);
    }).catch(error => {
      console.log(error);
      this.logoutButtonText = "Error!";
      setTimeout(() => {
        this.logoutButtonText = "Logout";
      }, 2000);
    });
  }

  changeMode(mode: string): void {
    this.selectedDriver = null;
    this.selectedTeam = null;
    console.log(mode)
    this.editMode = mode;
  }

  setSelectedData(data: any): void {
    if(this.editMode === 'driver') {
      this.selectedDriver = data;
      this.selectedTeam = null;
    }
    if(this.editMode === 'team') {
      this.selectedTeam = data;
      this.selectedDriver = null;
    }
  }
}
