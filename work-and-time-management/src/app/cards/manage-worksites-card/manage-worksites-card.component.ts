import { Component, OnInit, Input } from '@angular/core';
import { fadeInEnterWithDelayTrigger, translateXRightTrigger } from 'src/app/animations/animations';

@Component({
  selector: 'app-manage-worksites-card',
  templateUrl: './manage-worksites-card.component.html',
  styleUrls: ['./manage-worksites-card.component.scss'],
  animations: [
    fadeInEnterWithDelayTrigger,
    translateXRightTrigger
  ]
})
export class ManageWorksitesCardComponent implements OnInit {

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
