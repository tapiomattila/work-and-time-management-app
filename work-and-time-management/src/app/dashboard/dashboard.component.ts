import { Component, OnInit } from '@angular/core';
import { NavigationHandlerService } from '../services/navigation-handler.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User, UserQuery } from '../auth/user/';
import * as moment from 'moment';
import { Worksite, WorksitesQuery } from '../pages/worksites/state';
import { RouterRoutesEnum } from '../enumerations/global.enums';
import { WindowService } from '../services/window.service';
import { fadeInEnterTrigger, fadeInOutTrigger } from '../animations/animations';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  animations: [
    fadeInEnterTrigger,
    fadeInOutTrigger
  ]
})
export class DashboardComponent implements OnInit {

  openMenuModal = false;

  currentWorksite$: Observable<Worksite>;

  user$: Observable<User>;
  momentDay: moment.Moment;
  infos;

  constructor(
    private router: Router,
    private userQuery: UserQuery,
    private worksiteQuery: WorksitesQuery,
    public windowService: WindowService,
    public navigationHandlerService: NavigationHandlerService,
  ) { }

  ngOnInit() {
    this.momentDay = moment();
    this.user$ = this.userQuery.user$;
    this.currentWorksite$ = this.worksiteQuery.selectLastUpdatedWorksite();

    const arr = this.setDaysArray();
    const days = [];
    for (const el of arr) {
      const mom = moment(el);
      days.push({
        day: mom,
      });
    }
    this.infos = days;
  }

  toWorksites() {
    this.router.navigate([RouterRoutesEnum.WORKSITES]);
  }

  navigate(route: string, id?: string) {
    this.navigationHandlerService.navigateToRoute(route, id);
  }

  openMenu() {
    this.openMenuModal = true;
  }

  closedModal($event) {
    this.openMenuModal = false;
  }

  setDaysArray() {
    const arr = [];
    const day = moment().startOf('week').add(1, 'days');
    let index = 0;
    while (index <= 5) {
      if (index === 0) {
        arr.push(day.toISOString());
      }

      if (day.day() <= 6) {
        const mom2 = day.add(1, 'days');
        arr.push(mom2.toISOString());
      }
      index++;
    }
    return arr;
  }

}
