import { Component, OnInit, Input } from '@angular/core';
import { fadeInEnterWithDelayTrigger, translateXRightTrigger } from 'src/app/animations/animations';

@Component({
  selector: 'app-manage-users-card',
  templateUrl: './manage-users-card.component.html',
  styleUrls: ['./manage-users-card.component.scss'],
  animations: [
    fadeInEnterWithDelayTrigger,
    translateXRightTrigger
  ]
})
export class ManageUsersCardComponent implements OnInit {

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
