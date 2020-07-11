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

  selectedDriver: IDriver = null;
  selectedTeam: ITeam = null;
  selectedSeason: ISeason = null;
  selectedRace: IRace = null;

  allSeasons: ISeason[] = [];
  allRaces: IRace[] = [];
  races2019: IRace[] = [];
  races2020: IRace[] = [];
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
        //seasons
        this.allSeasons = allSeasons.sort((a: ISeason, b: ISeason) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        //drivers
        this.allDrivers = allDrivers.sort((a: IDriver, b: IDriver) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        //teams
        this.allTeams = allTeams.sort((a: ITeam, b: ITeam) => {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        });
        //races
        this.allRaces = allRaces;

        this.races2019 = this.allRaces.filter((race: IRace) => race["season-id"] === "6kkEVCFphZzoFUxEg564").sort((a: IRace, b: IRace) => {
          return parseFloat(a.round) - parseFloat(b.round);
        });

        this.races2020 = this.allRaces.filter((race: IRace) => race["season-id"] === "HaYN7zcCFJXEjs9lfYaU").sort((a: IRace, b: IRace) => {
          return parseFloat(a.round) - parseFloat(b.round);
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
    this.selectedSeason = null;
    this.selectedRace = null;
    this.editMode = mode;
  }

  setSelectedData(data: any): void {
    if(this.editMode === 'driver') {
      this.selectedDriver = data;
      this.selectedTeam = null;
      this.selectedSeason = null;
      this.selectedRace = null;
    }
    if(this.editMode === 'team') {
      this.selectedTeam = data;
      this.selectedDriver = null;
      this.selectedSeason = null;
      this.selectedRace = null;
    }
    if(this.editMode === 'season') {
      this.selectedSeason = data;
      this.selectedDriver = null;
      this.selectedTeam = null;
      this.selectedRace = null;
    }
    if(this.editMode === 'race') {
      this.selectedRace = data;
      this.selectedDriver = null;
      this.selectedTeam = null;
      this.selectedSeason = null;
    }
  }
}
