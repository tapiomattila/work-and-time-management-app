import { Component, OnInit } from '@angular/core';
import { NavigationHandlerService } from '../services/navigation-handler.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '../auth/user/user.model';
import * as moment from 'moment';
import { Worksite } from '../pages/worksites/state/worksites.model';
import { UserQuery } from '../auth/user/user.query';
import { WorksitesQuery } from '../pages/worksites/state/worksites.query';
import { HoursQuery } from '../auth/hours/hours.query';
import { map, switchMap } from 'rxjs/operators';
import { RouterRoutesEnum } from '../enumerations/global.enums';
import { UserService } from '../auth/user/user.service';
import { AuthService } from '../auth/state/auth.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  openMenuModal = false;

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
    private hoursQuery: HoursQuery,
    private userService: UserService,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    public navigationHandlerService: NavigationHandlerService,
  ) { }

  ngOnInit() {
    this.momentDay = moment();
    this.user$ = this.userQuery.user$;
    this.currentWorksite$ = this.worksiteQuery.selectAndSetCurrentWorksite();

    this.currentHours$ = this.currentWorksite$.pipe(
      map(el => el ? el.id : undefined),
      switchMap(id => id ? this.hoursQuery.selectHoursForWorksite(id) : of('')),
    );

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

  closeModal() {
    this.openMenuModal = false;
  }

  signout() {
    this.openMenuModal = false;
    this.userService.resetStore();
    this.authService.signOut();
    this.afAuth.auth.signOut();
    this.router.navigate([RouterRoutesEnum.WELCOME]);
  }

}
