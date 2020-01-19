import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-worksites',
  templateUrl: './worksites.component.html',
  styleUrls: ['./worksites.component.scss']
})
export class WorksitesComponent implements OnInit {

  constructor(
    private location: Location
  ) { }

  ngOnInit() {
  }

  locationBack() {
    this.location.back();
  }

}
