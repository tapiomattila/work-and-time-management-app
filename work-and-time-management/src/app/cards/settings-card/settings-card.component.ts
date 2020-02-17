import { Component, OnInit, Input } from '@angular/core';
import { fadeInEnterWithDelayTrigger, translateXRightTrigger } from 'src/app/animations/animations';

@Component({
  selector: 'app-settings-card',
  templateUrl: './settings-card.component.html',
  styleUrls: ['./settings-card.component.scss'],
  animations: [
    fadeInEnterWithDelayTrigger,
    translateXRightTrigger
  ]
})
export class SettingsCardComponent implements OnInit {

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
