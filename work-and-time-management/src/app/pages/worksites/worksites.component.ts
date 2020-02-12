import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { WindowService } from 'src/app/services/window.service';
import { fadeInEnterTrigger } from 'src/app/animations/animations';

@Component({
  selector: 'app-worksites',
  templateUrl: './worksites.component.html',
  styleUrls: ['./worksites.component.scss'],
  animations: [
    fadeInEnterTrigger
]
})
export class WorksitesComponent implements OnInit {

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
