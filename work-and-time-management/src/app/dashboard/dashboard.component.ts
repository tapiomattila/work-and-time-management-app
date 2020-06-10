import { Component, OnInit } from '@angular/core';
import { WindowService } from '../services/window.service';
import { CardService } from '../services/card.service';
import { NavigationHandlerService } from '../services/navigation-handler.service';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { User } from '../auth/user/user.model';
import * as moment from 'moment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

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
    public navigationHandlerService: NavigationHandlerService,
    public cardService: CardService,
    public windowService: WindowService,
  ) { }

  ngOnInit() {
    const user: User = {
      id: '89h9fds',
      firstName: 'John',
      lastName: 'Doe',
      isAdmin: true
    };
    this.user$ = of(user);

    this.momentDay = moment();
  }

  toWorksites() {
    this.router.navigate(['worksites']);
  }
}
