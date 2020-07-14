import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { IDriver, ISummary } from 'src/app/drivers/drivers-model';
import { DriversService } from 'src/app/drivers/drivers.service';
import { ITeam } from 'src/app/teams/teams-model';
import { TeamsService } from 'src/app/teams/teams.service';

@Component({
  selector: 'app-driver-edit-form',
  templateUrl: './driver-edit-form.component.html',
  styleUrls: ['./driver-edit-form.component.scss']
})
export class DriverEditFormComponent implements OnInit, OnChanges {

  @Input() driverData: IDriver;

  driverName: string = "";
  driverNumber: string = "";
  driverDob: string = "";
  driverNationality: string = "";
  driverPoles: string = "";
  driverPodiums: string = "";
  driverWins: string = "";
  driverChamps: string = "";
  driverTeam: string = "";
  allTeams: ITeam[];
  driverSummary: ISummary[];
  addSummary: boolean = false;
  newSummaryType: string = "text";
  newSummaryText: string = "";
  newSummaryTeam: string = "";
  newSummaryYear: string = "";
  newSummaryFrom: string = "";
  newSummaryTo: string = "";
  buttonName: string = "Submit";
  mode: string = "edit";
  tempId:string = "";

  constructor(private driversService: DriversService, private teamsService: TeamsService) {
    this.teamsService.teams$.subscribe(data => {
      this.allTeams = data;
    });
  }

  ngOnInit(): void {
    if (this.driverData) {
      this.updateData();
    }
  }

  ngOnChanges(): void {
    this.updateData();
  }

  updateData(): void {
    this.driverName = this.driverData.name;
    this.driverNumber = this.driverData.number;
    this.driverDob = this.driverData["date-of-birth"];
    this.driverNationality = this.driverData.nationality;
    this.driverPoles = this.driverData.poles;
    this.driverPodiums = this.driverData.podiums;
    this.driverWins = this.driverData.wins;
    this.driverChamps = this.driverData.championships;
    this.driverTeam = this.driverData["team-id"];
    this.driverSummary = this.driverData.summary;

    if (typeof(this.driverData) === 'string') {
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
      this.driversService.edit({
        id: this.driverData.id || this.tempId,
        name: this.driverName,
        number: this.driverNumber,
        "date-of-birth": this.driverDob,
        nationality: this.driverNationality,
        poles: this.driverPoles,
        podiums: this.driverPodiums,
        wins: this.driverWins,
        championships: this.driverChamps,
        "team-id": this.driverTeam,
        summary: this.driverSummary || []
      }).then(() => {
        this.buttonProgress("Done");
      }).catch(() => {
        this.buttonProgress("Error");
      });
    } else {
      this.driversService.add({
        name: this.driverName,
        number: this.driverNumber,
        "date-of-birth": this.driverDob,
        nationality: this.driverNationality,
        poles: this.driverPoles,
        podiums: this.driverPodiums,
        wins: this.driverWins,
        championships: this.driverChamps,
        "team-id": this.driverTeam,
        summary: this.driverSummary || []
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

  deleteSummaryItem(index: number): void {
    let fakeSummary: ISummary[] = [...this.driverSummary];
    fakeSummary.splice(index, 1);
    this.driverSummary = fakeSummary;
  }

  toggleAddSummaryMode(): void {
    this.addSummary = !this.addSummary;
  }

  addSummaryElement(): void {
    if(!this.driverSummary) {
      this.driverSummary = [];
    }

    switch(this.newSummaryType) {
      case ("text"): 
        this.driverSummary.push({
          type: this.newSummaryType,
          text: this.newSummaryText
        });
      break;
      case ("year"): 
        this.driverSummary.push({
          type: this.newSummaryType,
          team: this.newSummaryTeam,
          year: this.newSummaryYear
        });
      break;
      case ("transfer"): 
        this.driverSummary.push({
          type: this.newSummaryType,
          from: this.newSummaryFrom,
          to: this.newSummaryTo
        });
      break;
    }

    this.newSummaryType = "text";
    this.newSummaryText = "";
    this.newSummaryTeam = "";
    this.newSummaryYear = "";
    this.newSummaryFrom = "";
    this.newSummaryTo = "";
  }
}
