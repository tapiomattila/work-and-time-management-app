import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { User } from './auth/user/user.model';
import { Observable, Subscription } from 'rxjs';
import { UserQuery } from './auth/user/user.query';
import { WindowService } from './services/window.service';
import { fadeInEnterTrigger } from './animations/animations';
import { WorksitesService } from './pages/worksites/state/worksites.service';
import { NavigationHandlerService } from './services/navigation-handler.service';
import { WorksitesQuery } from './pages/worksites/state/worksites.query';
import { HoursService } from './auth/hours/hours.service';
import { switchMap } from 'rxjs/operators';
import { AuthService } from './auth/state/auth.service';

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
  // selection = '';

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.windowService.updateCurrentDimensions(window.innerWidth, window.innerHeight);
  }

  constructor(
    private worksiteService: WorksitesService,
    private worksiteQuery: WorksitesQuery,
    private userQuery: UserQuery,
    private hoursService: HoursService,
    private authService: AuthService,
    public navigationHandlerService: NavigationHandlerService,
    public windowService: WindowService
  ) { }

  ngOnInit() {
    this.firebaseAuthSubs = this.authService.firebaseAuthUpdate().subscribe();
    this.user$ = this.userQuery.user$;

    this.worksiteService.fetchAllWorksites()
      .subscribe(res => {
        this.worksiteService.setWorksites(res);
      });

    this.user$.pipe(
      switchMap(res => {
        return this.hoursService.fetchHours(res.id);
      })
    ).subscribe(res => {
      this.hoursService.setHours(res);
    });

    // this.worksiteQuery.selectAll().subscribe(res => console.log('show res in store', res));
    this.worksiteQuery.selectRecentlyUpdateWorksite();
  }

  ngOnDestroy() {
    if (this.firebaseAuthSubs !== undefined) {
      this.firebaseAuthSubs.unsubscribe();
    }
  }
}
