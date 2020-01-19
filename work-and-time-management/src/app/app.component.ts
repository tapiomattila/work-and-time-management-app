import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from './services/data.service';
import { User } from './auth/user/user.model';
import { UserService } from './auth/user/user.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserQuery } from './auth/user/user.query';
import { WindowService } from './services/window.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  user$: Observable<User>;
  days = ['ma', 'ti', 'ke', 'to', 'pe', 'la', 'su'];

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.windowService.updateCurrentDimensions(window.innerWidth, window.innerHeight);
  }

  constructor(
    private dataService: DataService,
    private userService: UserService,
    private userQuery: UserQuery,
    private router: Router,
    public windowService: WindowService
  ) { }

  ngOnInit() {
    this.user$ = this.userQuery.user$;
    this.dataService.getUser().pipe(
      tap((user: User) => this.userService.updateUser(user.id, user.name))
    ).subscribe();
  }

  // TODO, helper method, global
  navigateToCardContent(card: string) {
    this.router.navigate([`/${card}`]);
  }
}
