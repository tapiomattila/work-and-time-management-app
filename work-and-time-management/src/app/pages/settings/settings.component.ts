import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { WindowService } from 'src/app/services/window.service';
import { fadeInEnterTrigger, fadeInOutDelayTrigger } from 'src/app/animations/animations';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: [
    fadeInEnterTrigger,
    fadeInOutDelayTrigger
]
})
export class SettingsComponent implements OnInit {

  constructor(
    private location: Location,
    public windowService: WindowService
  ) { }

  ngOnInit() {
  }

  locationBack() {
    this.location.back();
  }

}
