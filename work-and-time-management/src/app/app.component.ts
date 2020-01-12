import { Component, OnInit } from '@angular/core';
import { DataService } from './services/data.service';
import { User } from './auth/user/user.model';
import { UserService } from './auth/user/user.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'work-and-time-management';

  constructor(
    private dataService: DataService,
    private userService: UserService
  ) { }

  ngOnInit() {
    this.dataService.getUser().pipe(
      tap((user: User) => this.userService.updateUser(user.id, user.name))
    ).subscribe();
  }
}
