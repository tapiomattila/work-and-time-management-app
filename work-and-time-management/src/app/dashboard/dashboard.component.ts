import { Component, OnInit } from '@angular/core';
import { UserQuery } from '../auth/user/user.query';
import { Observable } from 'rxjs';
import { User } from '../auth/user/user.model';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  user$: Observable<User>;
  days = ['ma', 'ti', 'ke', 'to', 'pe', 'la', 'su'];

  constructor(
    private userQuery: UserQuery
  ) { }

  ngOnInit() {
    this.user$ = this.userQuery.user$;
  }
}
