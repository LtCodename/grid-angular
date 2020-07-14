import { Component, OnInit, Input } from '@angular/core';
import { ISeason } from 'src/app/seasons/seasons-model';
import { DriversService } from 'src/app/drivers/drivers.service';
import { IDriver } from 'src/app/drivers/drivers-model';
import { SeasonsService } from 'src/app/seasons/seasons.service';
import { ITeam } from 'src/app/teams/teams-model';
import { mergeMap, map } from 'rxjs/operators';
import { TeamsService } from 'src/app/teams/teams.service';

interface IDriverToDisplay {
  id: string;
  name: string;
}

interface ITeamToDisplay {
  id: string;
  name: string;
}

@Component({
  selector: 'app-season-edit-form',
  templateUrl: './season-edit-form.component.html',
  styleUrls: ['./season-edit-form.component.scss']
})
export class SeasonEditFormComponent implements OnInit {

  @Input() seasonData: ISeason;

  seasonName: string = "";
  driverToAdd: string = "";
  teamToAdd: string = "";
  seasonCurrent: boolean = false;
  seasonDrivers: string[] = [];
  seasonTeams: string[] = [];
  allDrivers: IDriver[] = [];
  allTeams: ITeam[] = [];
  driversToDisplay: IDriverToDisplay[] = [];
  driversToSelect: IDriver[] = [];
  teamsToDisplay: ITeamToDisplay[] = [];
  teamsToSelect: ITeam[] = [];
  buttonName: string = "Submit";
  mode: string = "edit";
  tempId:string = "";

  constructor(private driversService: DriversService, private seasonService: SeasonsService, private teamsService: TeamsService) { 
    this.driversService.drivers$.pipe(
      mergeMap((allDrivers: IDriver[]) => this.teamsService.teams$.pipe(map((allTeams: ITeam[]): [IDriver[], ITeam[]] => [allDrivers, allTeams]))),
    ).subscribe(([allDrivers, allTeams]) => {
      this.allDrivers = allDrivers;
      this.allTeams = allTeams;
    });
  }

  ngOnInit(): void {
    if (this.seasonData) {
      this.updateData();
    }
  }

  ngOnChanges(): void {
    this.updateData();
  }

  updateData(): void {
    this.seasonName = this.seasonData.name;
    this.seasonCurrent = this.seasonData.current;
    this.seasonDrivers = this.seasonData.drivers;
    this.seasonTeams = this.seasonData.teams;

    //drivers
    this.driversToDisplay = [];
    if(this.allDrivers) {
      if(this.seasonDrivers) {
        this.seasonDrivers.forEach((driverId: string) => {
          this.driversToDisplay.push({
            id: driverId,
            name: this.allDrivers.find((driver: IDriver) => driver.id === driverId).name
          });
        });
      }

      this.recalculateDriversToAdd();
    }

    //teams
    this.teamsToDisplay = [];
    if(this.allTeams) {
      if(this.seasonTeams) {
        this.seasonTeams.forEach((teamId: string) => {
          this.teamsToDisplay.push({
            id: teamId,
            name: this.allTeams.find((team: ITeam) => team.id === teamId).name
          });
        });
      }

      this.recalculateTeamsToAdd();
    }

    if (typeof(this.seasonData) === 'string') {
      this.buttonName = "Add";
      this.mode = "add";
    } else {
      this.buttonName = "Submit";
      this.mode = "edit";
    }
  }

  submitData(): void {
    this.buttonName = "...";

    if(this.mode === "edit") { 
      this.seasonService.edit({
        id: this.seasonData.id || this.tempId,
        name: this.seasonName,
        current: this.seasonCurrent,
        drivers: this.seasonDrivers || [],
        teams: this.seasonTeams || []
      }).then(() => {
        this.buttonProgress("Done");
      }).catch(() => {
        this.buttonProgress("Error");
      });
    } else {
      this.seasonService.add({
        name: this.seasonName,
        current: this.seasonCurrent,
        drivers: this.seasonDrivers || [],
        teams: this.seasonTeams || []
      }).then((res) => {
        this.tempId = res.id;
        this.mode = "edit";
        this.buttonProgress("Done");
      }).catch(() => {
        this.buttonProgress("Error");
      });
    }
  }

  buttonProgress(message: string): void {
    this.buttonName = message;
    setTimeout(() => {
      this.buttonName = "Submit";
    }, 1000);
  }

  deleteDriver(index: number):void {
    let fakeDrivers: IDriverToDisplay[] = [...this.driversToDisplay];
    fakeDrivers.splice(index, 1);
    this.driversToDisplay = fakeDrivers;
    this.recalculateDriversToAdd();
  }

  deleteTeam(index: number):void {
    let fakeTeams: ITeamToDisplay[] = [...this.teamsToDisplay];
    fakeTeams.splice(index, 1);
    this.teamsToDisplay = fakeTeams;
    this.recalculateTeamsToAdd();
  }

  addDriver():void {
    if (this.driverToAdd === "") return;

    this.driversToDisplay.push({
      id: this.driverToAdd,
      name: this.allDrivers.find((driver: IDriver) => driver.id === this.driverToAdd).name
    });

    this.recalculateDriversToAdd();
  }

  addTeam():void {
    if (this.teamToAdd === "") return;

    this.teamsToDisplay.push({
      id: this.teamToAdd,
      name: this.allTeams.find((team: ITeam) => team.id === this.teamToAdd).name
    });

    this.recalculateTeamsToAdd();
  }

  recalculateDriversToAdd():void {
   this.driversToSelect = [];

   this.allDrivers.forEach((driver: IDriver) => {
     let found = this.driversToDisplay.find(dr => dr.id === driver.id);
     if  (!found) {
       this.driversToSelect.push(driver);
     }
   });

   this.driverToAdd = this.driversToSelect.length ? this.driversToSelect[0].id : "" || "";

   this.seasonDrivers = [];
   this.driversToDisplay.forEach((displayDriver: IDriverToDisplay) => {
     this.seasonDrivers.push(displayDriver.id);
   })
  }

  recalculateTeamsToAdd():void {
    this.teamsToSelect = [];
 
    this.allTeams.forEach((team: ITeam) => {
      let found = this.teamsToDisplay.find(tm => tm.id === team.id);
      if  (!found) {
        this.teamsToSelect.push(team);
      }
    });
 
    this.teamToAdd = this.teamsToSelect.length ? this.teamsToSelect[0].id : "" || "";
 
    this.seasonTeams = [];
    this.teamsToDisplay.forEach((displayTeam: ITeamToDisplay) => {
      this.seasonTeams.push(displayTeam.id);
    })
   }
}
