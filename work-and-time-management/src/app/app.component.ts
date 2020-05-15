import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from './services/data.service';
import { User } from './auth/user/user.model';
import { UserService } from './auth/user/user.service';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { UserQuery } from './auth/user/user.query';
import { WindowService } from './services/window.service';
import { fadeInEnterTrigger } from './animations/animations';
import { WorksitesService } from './worksites/state/worksites.service';
import { NavigationHandlerService } from './services/navigation-handler.service';
import { WorksitesQuery } from './worksites/state/worksites.query';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fadeInEnterTrigger
  ]
})
export class AppComponent implements OnInit {
  user$: Observable<User>;
  selection = '';

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.windowService.updateCurrentDimensions(window.innerWidth, window.innerHeight);
  }

  constructor(
    private dataService: DataService,
    private worksiteService: WorksitesService,
    private worksiteQuery: WorksitesQuery,
    private userService: UserService,
    private userQuery: UserQuery,
    public navigationHandlerService: NavigationHandlerService,
    public windowService: WindowService
  ) { }

  ngOnInit() {
    this.user$ = this.userQuery.user$;
    this.dataService.loadAllWorksites().subscribe(res => console.log('show load all courses res', res));

    this.dataService.loadAllUsers().pipe(
      tap((users: User[]) => this.userService.updateUser(users[0].id, users[0].firstName, users[0].lastName))
    ).subscribe(res => console.log('users resä', res));

    this.dataService.loadAllWorksites()
      .subscribe(res => {
        this.worksiteService.setWorksites(res);
      });

    this.worksiteQuery.selectAll().subscribe(res => console.log('show res in store', res));
    this.worksiteQuery.selectRecentlyUpdateWorksite();
  }
}
