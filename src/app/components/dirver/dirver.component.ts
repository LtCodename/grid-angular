import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-dirver',
  templateUrl: './dirver.component.html',
  styleUrls: ['./dirver.component.scss']
})
export class DirverComponent implements OnInit {

  @Input() small: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
