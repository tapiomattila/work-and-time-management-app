import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { WindowService } from './services/window.service';
import { NavigationHandlerService } from './services/navigation-handler.service';
import { User, UserQuery, UserService } from './auth/user';
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

  firebaseSubs: Subscription[] = [];
  storeSubs: Subscription[] = [];
  user$: Observable<User>;
  handleRoles$: Observable<any[]>;

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.windowService.updateCurrentDimensions(window.innerWidth, window.innerHeight);
  }

  constructor(
    private worksiteService: WorksitesService,
    private worktypeService: WorkTypeService,
    private hoursService: HoursService,
    private userQuery: UserQuery,
    private userService: UserService,
    private authQuery: AuthQuery,
    public authService: AuthService,
    public navigationHandlerService: NavigationHandlerService,
    public windowService: WindowService,
  ) { }

  ngOnInit() {
    this.authService.loader = true;
    const authSubs = this.authService.firebaseAuthUpdate().subscribe();
    this.firebaseSubs.push(authSubs);

    this.user$ = this.userQuery.user$;

    const storeUpdateSub = this.authQuery.select()
      .pipe(
        tap((auth: Auth) => {
          if (auth && auth.id !== null) {
            this.worksiteService.setWorksiteStore(auth.id).subscribe();
            this.worktypeService.setWorkTypeStore().subscribe();
            this.hoursService.setUserHours(auth.id).subscribe();
          } else {
            this.worksiteService.resetStore();
            this.hoursService.resetStore();
          }
        }),
        tap(auth => {
          if (auth && auth.id !== null) {

            this.handleRoles$ = this.userService.fetchAllRolesJoin();
            const fetchRolesSubs = this.handleRoles$.subscribe(res => {
              if (res && res.length) {
                res.forEach(el => {
                  if (el.length) {
                    this.userService.setRoles(el, auth.id);
                  }
                });
              }
            });

            this.firebaseSubs.push(fetchRolesSubs);
          }
        }),
      ).subscribe();

    this.storeSubs.push(storeUpdateSub);
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
    this.firebaseSubs.forEach(el => el.unsubscribe());
    this.storeSubs.forEach(el => el.unsubscribe());
  }
}
