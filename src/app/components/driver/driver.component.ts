import { Component, OnInit, Input, NgModule, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-driver',
  templateUrl: './driver.component.html',
  styleUrls: ['./driver.component.scss']
})
export class DriverComponent implements OnInit, OnChanges {

  @Input() small: boolean = false;
  @Input() name: string = "";
  @Input() carNumber: string = "";
  @Input() teamColor: string = "";
  
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.small) {
      this.shortenName();
    }
  }

  shortenName(): void {
    const nameArray = this.name.split(" ");
    const lastName: string = nameArray[1];
    if (lastName) {
      this.name = lastName.slice(0, 3).toLocaleUpperCase();
    }
  }
}

@NgModule({
  declarations: [DriverComponent],
  imports: [CommonModule
  ],
  exports: [DriverComponent]
})
export class DriverModule { }
