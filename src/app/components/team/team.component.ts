import { Component, OnInit, Input, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-team',
  templateUrl: './team.component.html',
  styleUrls: ['./team.component.scss']
})
export class TeamComponent implements OnInit {

  @Input() name: string = "";
  @Input() url: string = "";
  
  constructor() { }

  ngOnInit(): void {
  }

}

@NgModule({
  declarations: [TeamComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [TeamComponent]
})
export class TeamModule { }
