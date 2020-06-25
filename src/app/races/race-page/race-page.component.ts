import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RacesService } from '../races.service';
import { IRace } from '../race-model';
import { DomSanitizer } from '@angular/platform-browser';
import { ChequeredFlag } from 'src/iconsService';

@Component({
  selector: 'app-race-page',
  templateUrl: './race-page.component.html',
  styleUrls: ['./race-page.component.scss']
})
export class RacePageComponent implements OnInit {

  raceId: string = "";
  allRaces: IRace[];
  race: IRace;
  showData: boolean = false;

  readonly flagIcon = this.sanitized.bypassSecurityTrustHtml(ChequeredFlag);

  constructor(private route: ActivatedRoute, private racesService: RacesService, private sanitized: DomSanitizer) { 
    this.getQueryParam();

    this.racesService.races$.subscribe(data => {
      this.allRaces = data;
      this.race = this.allRaces.find((rc: IRace) => rc.id === this.raceId);

      if(this.race) {
        console.log(this.race);
        this.showData = true;
      }
    });
  }

  getQueryParam(): void {
    this.route.paramMap.subscribe(params => {
      this.raceId = params.get("race");
    });
  }

  ngOnInit(): void {
    this.getQueryParam();
  }

}
