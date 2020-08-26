import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { WindowService } from 'src/app/services/window.service';
import { fadeInEnterWithDelayTrigger, fadeInEnterTrigger } from 'src/app/animations/animations';
import { WorksitesQuery } from 'src/app/pages/worksites/state/worksites.query';
import { Observable } from 'rxjs';
import { Worksite } from 'src/app/pages/worksites/state/worksites.model';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { RouterRoutesEnum } from 'src/app/enumerations/global.enums';
import { NavigationHandlerService } from 'src/app/services/navigation-handler.service';

@Component({
  selector: 'app-worksites',
  templateUrl: './worksites.component.html',
  styleUrls: ['./worksites.component.scss'],
  animations: [
    fadeInEnterTrigger,
  ]
})
export class WorksitesComponent implements OnInit {

  worksites$: Observable<Worksite[]>;
  momentDay: moment.Moment;

  constructor(
    private location: Location,
    private worksitesQuery: WorksitesQuery,
    private router: Router,
    private navigationHandlerService: NavigationHandlerService,
    public windowService: WindowService,

  ) { }

  ngOnInit() {
    this.momentDay = moment();
    this.worksites$ = this.worksitesQuery.selectAllLiveWorksites();
  }

  locationBack() {
    this.location.back();
  }

  backArrowPressed(event: any) {
    this.router.navigate([`/${RouterRoutesEnum.DASHBOARD}`]);
  }

  navigate(route: string, id?: string) {
    this.navigationHandlerService.navigateToRoute(route, id);
  }

}
