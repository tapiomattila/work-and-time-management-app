import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { WindowService } from './services/window.service';
import { NavigationHandlerService } from './services/navigation-handler.service';
import { User, UserQuery } from './auth/user';
import { WorksitesService } from './pages/worksites/state';
import { HoursService } from './auth/hours';
import { Auth, AuthQuery, AuthService } from './auth/state';
import { WorkTypeService } from './worktype/state';
import { tap } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  animations: [
    trigger('routeState', [
      transition('* => *', [
        style({
          opacity: 0
        }), animate('400ms 100ms ease-in', style({
          opacity: 1
        }))
      ]),
    ])
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
  ) { }

  ngOnInit() {
    this.firebaseAuthSubs = this.authService.firebaseAuthUpdate().subscribe();
    this.user$ = this.userQuery.user$;

    this.authQuery.select()
      .pipe(
        tap((auth: Auth) => {
          console.log('show auth', auth);
          if (auth && auth.id !== null) {
            console.log('in tap auth found', auth);
            this.worksiteService.setWorksiteStore(auth.id).subscribe();
            this.worktypeService.setWorkTypeStore().subscribe();
            this.hoursService.setUserHours(auth.id).subscribe();
          } else {
            this.worksiteService.resetStore();
            this.hoursService.resetStore();
          }
        })
      ).subscribe();
  }

  getAnimationData(outlet: RouterOutlet) {
    // tslint:disable-next-line: no-string-literal
    const routeData = outlet.activatedRouteData['animation'];
    if (!routeData) {
      return 'rootPage';
    }
    // tslint:disable-next-line: no-string-literal
    return routeData['page'];
  }

  ngOnDestroy() {
    if (this.firebaseAuthSubs !== undefined) {
      this.firebaseAuthSubs.unsubscribe();
    }
  }
}
