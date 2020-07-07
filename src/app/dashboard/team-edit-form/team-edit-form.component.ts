import { Component, OnInit, Input } from '@angular/core';
import { ITeam } from 'src/app/teams/teams-model';
import { ISummary } from 'src/app/drivers/drivers-model';
import { TeamsService } from 'src/app/teams/teams.service';

@Component({
  selector: 'app-team-edit-form',
  templateUrl: './team-edit-form.component.html',
  styleUrls: ['./team-edit-form.component.scss']
})
export class TeamEditFormComponent implements OnInit {

  @Input() teamData: ITeam;

  teamName: string = "";
  teamNameFull: string = "";
  teamCountry: string = "";
  teamPrincipal: string = "";
  teamEngine: string = "";
  teamChamps: string = "";
  teamWins: string = "";
  teamPodiums: string = "";
  teamPoles: string = "";
  addSummary: boolean = false;
  addSummaryYear: boolean = false;
  teamSummary: ISummary[];

  newYearChamp: boolean = false;
  newYearName: string = "";
  newSummaryType: string = "text";
  newSummaryText: string = "";

  constructor(private teamsService: TeamsService) { }

  ngOnInit(): void {
    if (this.teamData) {
      this.updateData();
    }
  }

  ngOnChanges(): void {
    this.updateData();
  }

  updateData(): void {
    this.teamName = this.teamData.name;
    this.teamNameFull = this.teamData["name-full"];
    this.teamCountry = this.teamData.country;
    this.teamPrincipal = this.teamData["team-principal"];
    this.teamEngine = this.teamData.engine;
    this.teamChamps = this.teamData["constructors-championships"];
    this.teamWins = this.teamData.wins;
    this.teamPodiums = this.teamData.podiums;
    this.teamPoles = this.teamData.poles;
    this.teamSummary = this.teamData.summary;
  }

  submitData(): void {
    this.teamsService.edit({
      id: this.teamData.id,
      name: this.teamName,
      "name-full": this.teamNameFull,
      country: this.teamCountry,
      "team-principal": this.teamPrincipal,
      engine: this.teamEngine,
      "constructors-championships": this.teamChamps,
      wins: this.teamWins,
      podiums: this.teamPodiums,
      poles: this.teamPoles,
      summary: this.teamSummary || []
    }).then(() => {
      console.log("Data updated succesfully!");
    }).catch(() => {
      console.log("Error!");
    });
  }

  toggleAddSummaryMode(): void {
    this.addSummary = !this.addSummary;
  }

  deleteSummaryItem(index: number): void {
    let fakeSummary: ISummary[] = [...this.teamSummary];
    fakeSummary.splice(index, 1);
    this.teamSummary = fakeSummary;
  }

  deleteSummaryYearItem(): void {
    // let fakeSummary: ISummary[] = [...this.teamSummary];
    // fakeSummary.splice(index, 1);
    // this.teamSummary = fakeSummary;
  }

  addSummaryYearItem(): void {
    //?
  }

  toggleAddSummaryYearItemMode(): void {
    this.addSummaryYear = !this.addSummaryYear;
  }

  addSummaryElement(): void {
    if(!this.teamSummary) {
      this.teamSummary = [];
    }

    switch(this.newSummaryType) {
      case ("text"): 
        this.teamSummary.push({
          type: this.newSummaryType,
          text: this.newSummaryText
        });
      break;
      // case ("years"): 
      //   this.driverSummary.push({
      //     type: this.newSummaryType,
      //     team: this.newSummaryTeam,
      //     year: this.newSummaryYear
      //   });
      // break;
    }

    this.newSummaryType = "text";
    this.newSummaryText = "";
    this.newYearChamp = false;
    this.newYearName = "";
  }
}
