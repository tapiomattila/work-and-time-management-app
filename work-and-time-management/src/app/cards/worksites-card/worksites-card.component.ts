import { Component, OnInit, Input } from '@angular/core';
import { fadeInEnterWithDelayTrigger, translateXRightTrigger } from 'src/app/animations/animations';

@Component({
  selector: 'app-worksites-card',
  templateUrl: './worksites-card.component.html',
  styleUrls: ['./worksites-card.component.scss'],
  animations: [
    fadeInEnterWithDelayTrigger,
    translateXRightTrigger
  ]
})
export class WorksitesCardComponent implements OnInit {

  showIcon = false;
  moved = 'default';

  @Input()
  set icon(value: any) {
    this.showIcon = value.active;
    value.active ? this.moved = 'moved' : this.moved = 'default';
  }

  constructor() { }

  ngOnInit() {
  }

}
