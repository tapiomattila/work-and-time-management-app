import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { WindowService } from 'src/app/services/window.service';
import { fadeInEnterTrigger, fadeInOutDelayTrigger, fadeInEnterWithDelayTrigger } from 'src/app/animations/animations';
import { WorksitesQuery } from 'src/app/pages/worksites/state/worksites.query';
import { Observable } from 'rxjs';
import { Worksite } from 'src/app/pages/worksites/state/worksites.model';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { RouterRoutesEnum } from 'src/app/enumerations/global.enums';

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

  worksites$: Observable<Worksite[]>;
  momentDay: moment.Moment;

  constructor(
    private location: Location,
    private worksitesQuery: WorksitesQuery,
    private router: Router,
    public windowService: WindowService,

  ) { }

  ngOnInit() {
    this.momentDay = moment();
    this.worksites$ = this.worksitesQuery.selectAll();
  }

  locationBack() {
    this.location.back();
  }

  backArrowPressed(event: any) {
    this.router.navigate([`/${RouterRoutesEnum.DASHBOARD}`]);
  }

}
