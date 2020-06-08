import { Component } from '@angular/core';

export interface ITab {
  id: string;
  name: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  tabs: ITab[] = [
    {
      id: "seasons",
      name: "Seasons"
    },
    {
      id: "drivers",
      name: "Drivers"
    },
    {
      id: "teams",
      name: "Teams"
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
