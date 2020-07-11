import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { fadeInEnterTrigger } from './animations/animations';
import { WindowService } from './services/window.service';
import { NavigationHandlerService } from './services/navigation-handler.service';
import { User, UserQuery } from './auth/user';
import { WorksitesService, WorksitesQuery } from './pages/worksites/state';
import { HoursService } from './auth/hours';
import { Auth, AuthQuery, AuthService } from './auth/state';
import { WorkTypeService, WorkTypeQuery } from './worktype/state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    fadeInEnterTrigger
  ]
})
export class AppComponent implements OnInit, OnDestroy {

  firebaseAuthSubs: Subscription;

  user$: Observable<User>;

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.windowService.updateCurrentDimensions(window.innerWidth, window.innerHeight);
  }

  constructor(
    private worksiteService: WorksitesService,
    private worktypeService: WorkTypeService,
    private hoursService: HoursService,
    private userQuery: UserQuery,
    private authService: AuthService,
    private authQuery: AuthQuery,
    public navigationHandlerService: NavigationHandlerService,
    public windowService: WindowService,

    // TESTING
    private worksiteQuery: WorksitesQuery,
    private worktypeQuery: WorkTypeQuery,
    ) { }

  ngOnInit() {
    this.firebaseAuthSubs = this.authService.firebaseAuthUpdate().subscribe();
    this.user$ = this.userQuery.user$;

    this.authQuery.select()
      .subscribe((auth: Auth) => {
        if (auth && auth.id !== undefined) {
          // this.worksiteService.setWorksiteStore(auth.id).subscribe(res => console.log('show worksites', res));
          this.worktypeService.setWorkTypeStore().subscribe();
          // this.hoursService.setUserHours(auth.id).subscribe(res => console.log('show hours', res));
        } else {
          this.worksiteService.resetStore();
          this.hoursService.resetStore();
        }
      });

    // this.worksiteQuery.selectAll().subscribe(res => console.log('show all', res));
    // this.worksiteQuery.selectLast().subscribe();
    // // this.worksiteQuery.selectActive().subscribe();
    // this.worksiteQuery.selectActiveId().subscribe(res => console.log('show active id', res));

    // this.worksiteQuery.selectActive().subscribe();
    // this.worktypeQuery.selectAll().subscribe(res => console.log('show res in worktypes', res));
  }

  ngOnDestroy() {
    if (this.firebaseAuthSubs !== undefined) {
      this.firebaseAuthSubs.unsubscribe();
    }
  }
}
