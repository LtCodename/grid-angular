import { Component, OnInit } from '@angular/core';
import { SeasonsService } from '../seasons.service';
import { ISeason } from '../seasons-model';
import { IRace } from 'src/app/races/race-model';
import { RacesService } from 'src/app/races/races.service';

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
  showData: boolean = false;
  eventsTabName: string = "upcoming";

  constructor(private seasonsService: SeasonsService, private racesService: RacesService) { 
    //Get all seasons
    this.seasonsService.seasons$.subscribe(data => {
      this.allSeasons = data;
      //Determine current season
      this.currentSeason = this.allSeasons.find((season: ISeason) => season.current);

      if(this.currentSeason) {
        //Get all races
        this.racesService.races$.subscribe(races => {
          this.allRaces = races;

          this.seasonRaces = this.allRaces.filter((race: IRace) => race["season-id"] === this.currentSeason.id);
          //Determine this season races

          if (this.seasonRaces) {
            //Determine upcoming races
            this.upcomingRaces = this.seasonRaces.filter((race: IRace) => !race.finished).sort((a: IRace, b: IRace) => {
              if (a.round < b.round) {
                return -1;
              }
              if (a.round > b.round) {
                return 1;
              }
              return 0;
            });
            //Determine past races
            this.pastRaces = this.seasonRaces.filter((race: IRace) => race.finished).sort((a: IRace, b: IRace) => {
              if (a.round < b.round) {
                return -1;
              }
              if (a.round > b.round) {
                return 1;
              }
              return 0;
            });

            console.log(this.seasonRaces);
            this.showData = true;
          }
        });
      }
    });
  }

  toggleEventsTab(): void {
    if (this.eventsTabName === "upcoming") {
      this.eventsTabName = "past";
    } else {
      this.eventsTabName = "upcoming";
    }
  }

  ngOnInit(): void {
  }

}
