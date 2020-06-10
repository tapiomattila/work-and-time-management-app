import { Component, OnInit } from '@angular/core';
import { NavigationHandlerService } from '../services/navigation-handler.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '../auth/user/user.model';
import * as moment from 'moment';
import { Worksite } from '../pages/worksites/state/worksites.model';
import { UserQuery } from '../auth/user/user.query';
import { WorksitesService } from '../pages/worksites/state/worksites.service';
import { WorksitesQuery } from '../pages/worksites/state/worksites.query';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  currentWorksite$: Observable<Worksite>;
  currentHours$: Observable<string>;

  user$: Observable<User>;
  momentDay: moment.Moment;

  infos = [
    {
      day: new Date('6.1.2020'),
      hour: '6.75'
    },
    {
      day: new Date('6.2.2020'),
      hour: '9'
    },
    {
      day: new Date('6.3.2020'),
      hour: '11'
    },
    {
      day: new Date('6.4.2020'),
      hour: '9.5'
    },
    {
      day: new Date('6.5.2020'),
      hour: '0'
    }
  ];

  constructor(
    private router: Router,
    private userQuery: UserQuery,
    private worksiteQuery: WorksitesQuery,
    public navigationHandlerService: NavigationHandlerService,
  ) { }

  ngOnInit() {
    this.momentDay = moment();
    this.user$ = this.userQuery.user$;
    this.currentWorksite$ = this.worksiteQuery.selectAndSetCurrentWorksite();

    this.currentWorksite$.subscribe(res => console.log('res in current', res));
    this.currentHours$ = of('52');
    this.userQuery.user$.subscribe(res => console.log('show res in users', res));
  }

  toWorksites() {
    this.router.navigate(['worksites']);
  }

  navigate(route: string, id?: string) {
    this.navigationHandlerService.navigateToRoute(route, id);
  }

  test() {
    console.log('show test');
  }
}
