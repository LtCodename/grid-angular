import { Component, OnInit, Input, NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent implements OnInit {

  text: string = "";

  @Input() buttonText: string = "";

  constructor() { 
    this.text = this.buttonText;
  }

  ngOnInit(): void {
    this.text = this.buttonText;
  }

}

@NgModule({
  declarations: [ButtonComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [ButtonComponent]
})
export class ButtonModule { }
