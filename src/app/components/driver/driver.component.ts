import { Component, OnInit, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss']
})
export class DriverComponent implements OnInit {

  @Input() small: boolean = false;
  @Input() name: string = "";
  @Input() carNumber: string = "";
  @Input() teamColor: string = "";
  
  constructor() { }

  ngOnInit(): void {
  }

}

@NgModule({
  declarations: [DriverComponent],
  imports: [CommonModule
  ],
  exports: [DriverComponent]
})
export class DriverModule { }
