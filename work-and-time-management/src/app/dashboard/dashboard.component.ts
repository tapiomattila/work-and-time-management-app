import { Component, OnInit } from '@angular/core';
import { NavigationHandlerService } from '../services/navigation-handler.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User, UserQuery, UserService } from '../auth/user/';
import * as moment from 'moment';
import { Worksite, WorksitesQuery } from '../pages/worksites/state';
import { RouterRoutesEnum } from '../enumerations/global.enums';
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
    private userService: UserService,
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    public navigationHandlerService: NavigationHandlerService,
  ) { }

  ngOnInit() {
    this.momentDay = moment();
    this.user$ = this.userQuery.user$;
    this.currentWorksite$ = this.worksiteQuery.selectLastUpdatedWorksite();
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
    this.userService.resetAllStores();
    this.authService.signOut();
    this.afAuth.auth.signOut();
    this.router.navigate([RouterRoutesEnum.WELCOME]);
  }

}
