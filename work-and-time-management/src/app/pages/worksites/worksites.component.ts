import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { WindowService } from 'src/app/services/window.service';
import { fadeInEnterTrigger } from 'src/app/animations/animations';
import { WorksitesQuery } from 'src/app/worksites/state/worksites.query';
import { Observable } from 'rxjs';
import { Worksite } from 'src/app/worksites/state/worksites.model';

@Component({
  selector: 'app-worksites',
  templateUrl: './worksites.component.html',
  styleUrls: ['./worksites.component.scss'],
  animations: [
    fadeInEnterTrigger
]
})
export class WorksitesComponent implements OnInit {

  worksites$: Observable<Worksite[]>;

  constructor(
    private location: Location,
    private worksitesQuery: WorksitesQuery,
    public windowService: WindowService
  ) { }

  ngOnInit() {
    this.worksites$ = this.worksitesQuery.selectAll();
  }

  locationBack() {
    this.location.back();
  }

}
