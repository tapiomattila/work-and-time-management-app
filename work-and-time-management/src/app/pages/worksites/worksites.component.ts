import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { WindowService } from 'src/app/services/window.service';
import { fadeInEnterTrigger, fadeInOutDelayTrigger, fadeInEnterWithDelayTrigger } from 'src/app/animations/animations';
import { WorksitesQuery } from 'src/app/pages/worksites/state/worksites.query';
import { Observable } from 'rxjs';
import { Worksite } from 'src/app/pages/worksites/state/worksites.model';
import { Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-worksites',
  templateUrl: './worksites.component.html',
  styleUrls: ['./worksites.component.scss'],
  animations: [
    fadeInEnterTrigger,
    fadeInOutDelayTrigger,
    fadeInEnterWithDelayTrigger,
  ]
})
export class WorksitesComponent implements OnInit {

  momentDay: moment.Moment;

  constructor(
    private location: Location,
    private worksitesQuery: WorksitesQuery,
    private router: Router,
    public windowService: WindowService,

  ) { }

  ngOnInit() {
    this.momentDay = moment();
  }

  locationBack() {
    this.location.back();
  }

  backArrowPressed(event: any) {
    this.router.navigate(['/dashboard']);
  }

}
