import { Component, OnInit } from '@angular/core';
import { SeasonsService } from '../seasons.service';
import { ISeason } from '../seasons-model';
import { IRace } from 'src/app/races/race-model';
import { RacesService } from 'src/app/races/races.service';
import { PointsSystem } from 'src/app/app-model';

@Component({
  selector: 'app-seasons-page',
  templateUrl: './seasons-page.component.html',
  styleUrls: ['./seasons-page.component.scss']
})
export class SeasonsPageComponent implements OnInit {

  allSeasons: ISeason[] = [];
  allRaces: IRace[] = [];
  seasonRaces: IRace[] = [];
  upcomingRaces: IRace[] = [];
  pastRaces: IRace[] = [];
  currentSeason: ISeason;
  driversStandings = [];
  showData: boolean = false;
  eventsTabName: string = "upcoming";
  standingsTabName: string = "drivers";

  constructor(private seasonsService: SeasonsService, private racesService: RacesService) { 
    //Get all seasons
    this.seasonsService.seasons$.subscribe(data => {
      this.allSeasons = data;
      //Determine current season
      this.currentSeason = this.setCurrentSeason(this.allSeasons);

      if(this.currentSeason) {
        //Get all races
        this.racesService.races$.subscribe(races => {
          this.allRaces = races;

          //Determine this season races
          this.seasonRaces = this.setSeasonRaces(this.allRaces);
          
          if (this.seasonRaces) {
            //Determine upcoming races
            this.upcomingRaces = this.setUpcomingRaces(this.seasonRaces);

            //Determine past races
            this.pastRaces = this.setPastRaces(this.seasonRaces);

            // Caclulate drivers standings
            this.driversStandings = this.calculateDriversStandings(this.pastRaces);
            console.log(this.driversStandings);

            this.showData = true;
          }
        });
      }
    });
  }

  setCurrentSeason(seasonsData: ISeason[]): ISeason {
    return seasonsData.find((season: ISeason) => season.current);
  }

  setSeasonRaces(racesData: IRace[]): IRace[] {
    return racesData.filter((race: IRace) => race["season-id"] === this.currentSeason.id);
  }

  setUpcomingRaces(racesData: IRace[]): IRace[] {
    return racesData.filter((race: IRace) => !race.finished).sort((a: IRace, b: IRace) => {
      if (a.round < b.round) {
        return -1;
      }
      if (a.round > b.round) {
        return 1;
      }
      return 0;
    });
  }

  setPastRaces(racesData: IRace[]): IRace[] {
    return racesData.filter((race: IRace) => race.finished).sort((a: IRace, b: IRace) => {
      if (a.round < b.round) {
        return -1;
      }
      if (a.round > b.round) {
        return 1;
      }
      return 0;
    });
  }

  calculateDriversStandings(racesData: IRace[]): IRace[] {
    let standingsHash = {};
    let standings = [];

    racesData.forEach((race: IRace) => {
      if (race.places) {
        for (let place in race.places) {
          if (standingsHash[race.places[place].driver]) {
            standingsHash[race.places[place].driver] += PointsSystem[place];
          } else {
            standingsHash[race.places[place].driver] = PointsSystem[place];
          }
        }
      }

      if (race.lap) {
        standingsHash[race.lap] ++;
      }
    });

    //Convert drivers standings hash table into an array
    Object.keys(standingsHash).forEach((driverId: string) => {
      standings.push({
        id: driverId,
        points: standingsHash[driverId]
      })
    })

    //TODO change id's to names in array

    return standings;
  }

  toggleEventsTab(): void {
    if (this.eventsTabName === "upcoming") {
      this.eventsTabName = "past";
    } else {
      this.eventsTabName = "upcoming";
    }
  }

  toggleStandingsTab(): void {
    if (this.standingsTabName === "drivers") {
      this.standingsTabName = "teams";
    } else {
      this.standingsTabName = "drivers";
    }
  }

  ngOnInit(): void {
  }
}
