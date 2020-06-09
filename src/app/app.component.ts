import { Component } from '@angular/core';
import { ITab } from './model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  tabs: ITab[] = [
    {
      id: "seasons",
      name: "Season",
      url: "/season"
    },
    {
      id: "drivers",
      name: "Drivers",
      url: "/drivers"
    },
    {
      id: "teams",
      name: "Teams",
      url: "/teams"
    }
  ]

  showPanels = {
    seasons: false,
    drivers: false,
    teams: false
  }

  activePanels = {
    seasons: false,
    drivers: false,
    teams: false
  }

  timeout: any = 0;
  
  tabMouseEnter(panelName: string): void {
    this.timeout = setTimeout(() => {
      this.showPanels[panelName] = true;
    }, 1000);
  }

  tabMouseLeave(panelName: string): void {
    clearTimeout(this.timeout);

    setTimeout(() => {
      if (!this.activePanels[panelName]) {
        this.showPanels[panelName] = false;
      }
    }, 1000);
  }

  panelMouseEnter(panelName: string): void {
    this.activePanels[panelName] = true;
  }

  panelMouseLeave(panelName: string): void {
    setTimeout(() => {
      this.activePanels[panelName] = false;
      this.showPanels[panelName] = false;
    }, 1000);
  }
}
