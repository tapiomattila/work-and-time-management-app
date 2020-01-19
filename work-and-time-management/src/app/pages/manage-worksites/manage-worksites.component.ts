import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-manage-worksites',
  templateUrl: './manage-worksites.component.html',
  styleUrls: ['./manage-worksites.component.scss']
})
export class ManageWorksitesComponent implements OnInit {

  constructor(
    private location: Location
  ) { }

  ngOnInit() {
  }

  locationBack() {
    this.location.back();
  }

}
