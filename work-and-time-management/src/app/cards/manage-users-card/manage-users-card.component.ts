import { Component, OnInit, Input } from '@angular/core';
import { fadeInEnterWithDelayTrigger } from 'src/app/animations/animations';

@Component({
  selector: 'app-manage-users-card',
  templateUrl: './manage-users-card.component.html',
  styleUrls: ['./manage-users-card.component.scss'],
  animations: [
    fadeInEnterWithDelayTrigger
  ]
})
export class ManageUsersCardComponent implements OnInit {

  @Input() class: string;
  constructor() { }

  ngOnInit() {
  }

}
