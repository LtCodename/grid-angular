import { Component, OnInit, Input } from '@angular/core';
import { IRace, IRaceResult, INote } from 'src/app/races/race-model';
import { SeasonsService } from 'src/app/seasons/seasons.service';
import { ISeason } from 'src/app/seasons/seasons-model';
import { IDriver } from 'src/app/drivers/drivers-model';
import { DriversService } from 'src/app/drivers/drivers.service';
import { map, mergeMap } from 'rxjs/operators';
import { TeamsService } from 'src/app/teams/teams.service';
import { ITeam } from 'src/app/teams/teams-model';
import { RacesService } from 'src/app/races/races.service';
import { PositionsBlueprint } from 'src/app/app-model';

@Component({
  selector: 'app-race-edit-form',
  templateUrl: './race-edit-form.component.html',
  styleUrls: ['./race-edit-form.component.scss']
})
export class RaceEditFormComponent implements OnInit {

  @Input() raceData: IRace;

  raceName: string = "";
  raceNameFull: string = "";
  raceLocation: string = "";
  raceDate: string = "";
  raceSeason: string = "";
  raceLap: string = "";
  raceLapTeam: string = "";
  raceRound: string = "";
  racePole: string = "";
  raceOngoing: string = "false";
  raceFinished: string = "false";
  raceCircuit: string = "";
  raceSummary: string = "";
  racePlaces = {};
  raceNotes: INote[] = [];
  buttonName: string = "Submit";
  mode: string = "edit";
  tempId:string = "";
  addNote: boolean = false;
  newNoteEvent: string = "race";
  newNoteStage: string = "";
  newNoteText: string = "";
  newNoteImportant: string = "false";
  
  allSeasons: ISeason[] = [];
  allDrivers: IDriver[] = [];
  allTeams: ITeam[] = [];
  currentSeason: ISeason;
  seasonDrivers: IDriver[] = [];
  raceResults: IRaceResult[] = [];

  constructor(
      private seasonsService: SeasonsService, 
      private driversService: DriversService, 
      private teamsService: TeamsService,
      private racesService: RacesService
    ) { 
    this.seasonsService.seasons$.pipe(
      mergeMap((allSeasons: ISeason[]) => this.driversService.drivers$.pipe(map((allDrivers: IDriver[]): [ISeason[], IDriver[]] => [allSeasons, allDrivers]))),
      mergeMap(([allSeasons, allDrivers]) => this.teamsService.teams$.pipe(map((allTeams: ITeam[]): [ISeason[], IDriver[], ITeam[]] => [allSeasons, allDrivers, allTeams]))),
    ).subscribe(([allSeasons, allDrivers, allTeams]) => {
      if (allSeasons.length && allDrivers.length) {
        this.allSeasons = allSeasons;
        this.allDrivers = allDrivers;
        this.allTeams = allTeams;
      }
    }, () => {

    });
  }

  ngOnInit(): void {
    if (this.raceData) {
      this.updateData();
    }
  }

  ngOnChanges(): void {
    this.updateData();
  }

  updateData(): void {
    this.raceName = this.raceData.name;
    this.raceNameFull = this.raceData.fullName;
    this.raceLocation = this.raceData.location;
    this.raceDate = this.raceData.date;
    this.raceSeason = this.raceData["season-id"];
    this.raceLap = this.raceData.lap;
    this.raceLapTeam = this.raceData["lap-team"];
    this.raceRound = this.raceData.round;
    this.raceFinished = this.raceData.finished ? "true" : "false";
    this.raceOngoing = this.raceData.ongoing ? "true" : "false";
    this.racePole = this.raceData.pole;
    this.raceCircuit = this.raceData.circuit;
    this.racePlaces = this.raceData.places;
    this.raceSummary = this.raceData.summary;
    this.raceNotes = this.raceData.notes;

    this.setInformation();

    if (typeof(this.raceData) === 'string') {
      this.buttonName = "Add";
      this.mode = "add";
    } else {
      this.buttonName = "Submit";
      this.mode = "edit";
    }
  }

  setInformation(): void {
    //Retrieve current season
    this.currentSeason = this.allSeasons.find((season: ISeason) => season.id === this.raceSeason);
    
    //Season drivers
    this.seasonDrivers = [];
    this.allDrivers.forEach((dr: IDriver) => {
      if (this.currentSeason && this.currentSeason.drivers.length && this.currentSeason.drivers.indexOf(dr.id) !== -1) {
        this.seasonDrivers.push(dr);
      }
    });

    //Race results
    this.raceResults = [];
    if (!this.racePlaces) {
      PositionsBlueprint.forEach(elem => {
        this.raceResults.push({
          driver: "",
          team: "",
          points: elem.points,
          place: elem.place
        });
      });
    } else {
      PositionsBlueprint.forEach(elem => {
        this.raceResults.push({
          driver: this.racePlaces[elem.place].driver,
          team: this.racePlaces[elem.place].team,
          points: elem.points,
          place: elem.place
        });
      });
    }
  }

  submitData(): void {
    this.buttonName = "...";
    
    this.racePlaces = {};

    this.raceResults.forEach((result: IRaceResult) => {
      this.racePlaces[result.place] = {
        driver: result.driver,
        team: result.team
      }
    });

    if(this.mode === "edit") {
      this.racesService.edit({
        id: this.raceData.id || this.tempId,
        name: this.raceName,
        fullName: this.raceNameFull || "",
        circuit: this.raceCircuit || "",
        location: this.raceLocation,
        date: this.raceDate,
        summary: this.raceSummary || "",
        "season-id": this.raceSeason,
        lap: this.raceLap || "",
        "lap-team": this.raceLapTeam || "",
        round: this.raceRound,
        finished: this.raceFinished === 'true',
        ongoing: this.raceOngoing === 'true',
        pole: this.racePole || "",
        places: this.racePlaces || {},
        notes: this.raceNotes || []
      }).then(() => {
        this.buttonProgress("Done");
      }).catch(() => {
        this.buttonProgress("Error");
      });
    } else {
      this.racesService.add({
        name: this.raceName,
        fullName: this.raceNameFull || "",
        circuit: this.raceCircuit || "",
        location: this.raceLocation,
        date: this.raceDate,
        summary: this.raceSummary || "",
        "season-id": this.raceSeason,
        lap: this.raceLap || "",
        "lap-team": this.raceLapTeam || "",
        round: this.raceRound,
        finished: this.raceFinished === 'true',
        ongoing: this.raceOngoing === 'true',
        pole: this.racePole || "",
        places: this.racePlaces || {},
        notes: this.raceNotes || []
      }).then((res) => {
        this.tempId = res.id;
        this.mode = "edit";
        this.buttonProgress("Done");
      }).catch(() => {
        this.buttonProgress("Error");
      });
    }
  }

  deleteNote(index: number): void {
    let fakeNotes: INote[] = [...this.raceNotes];
    fakeNotes.splice(index, 1);
    this.raceNotes = fakeNotes;
  }

  toggleAddNoteMode(): void {
    this.addNote = !this.addNote;
  }

  addNewNote(): void {
    if(!this.raceNotes) {
      this.raceNotes = [];
    }

    this.raceNotes.push({
      event: this.newNoteEvent,
      stage: this.newNoteStage,
      note: this.newNoteText,
      important: this.newNoteImportant === 'true'
    });

    this.newNoteEvent = "race";
    this.newNoteStage = "";
    this.newNoteText = "";
    this.newNoteImportant = "false";
  }

  buttonProgress(message: string): void {
    this.buttonName = message;
    setTimeout(() => {
      this.buttonName = "Submit";
    }, 1000);
  }
}
