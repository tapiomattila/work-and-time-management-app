import { Component, OnInit, Input } from '@angular/core';
import { fadeInEnterWithDelayTrigger } from 'src/app/animations/animations';

@Component({
  selector: 'app-settings-card',
  templateUrl: './settings-card.component.html',
  styleUrls: ['./settings-card.component.scss'],
  animations: [
    fadeInEnterWithDelayTrigger
  ]
})
export class SettingsCardComponent implements OnInit {

  @Input() class: string;
  constructor() { }

  ngOnInit() {
  }

}
