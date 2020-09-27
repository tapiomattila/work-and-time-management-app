import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { interval, Observable, of, Subscription, timer } from 'rxjs';
import { WindowService } from './services/window.service';
import { NavigationHandlerService } from './services/navigation-handler.service';
import { User, UserQuery, UserService } from './auth/user';
import { WorksitesService } from './pages/worksites/state';
import { HoursService } from './auth/hours';
import { Auth, AuthQuery, AuthService } from './auth/state';
import { WorkTypeService } from './worktype/state';
import { map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { ManageService } from './pages/manage,service';

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
    public manageService: ManageService,
    public authService: AuthService,
    public navigationHandlerService: NavigationHandlerService,
    public windowService: WindowService,
  ) { }

  ngOnInit() {
    this.authService.loader = true;
    const authSubs = this.authService.firebaseAuthUpdate().subscribe();
    this.firebaseSubs.push(authSubs);

    this.user$ = this.userQuery.user$;

    // this.user$.subscribe(res => console.log('user subs', res));
    // this.authQuery.select().subscribe(res => console.log('show res in auth', res));

    this.nullOrValid();

    const storeUpdateSub = this.authQuery.select()
      .pipe(
        tap((auth: Auth) => {
          if (auth && auth.id !== null && auth.clientId !== null) {
            this.updateStores(auth);
            this.handleRoles(auth);
          }
        }),
      ).subscribe();

    this.storeSubs.push(storeUpdateSub);
  }

  /**
   * Checks auth state on interval and sets please register modal
   * if no client id is presense on authenticated user
   */
  nullOrValid() {
    const interval$ = interval(1000);
    const timer$ = timer(6000);

    let lap = 0;
    const nullOrValidSubs = this.userQuery.select().pipe(
      switchMap(user => {
        if ((user.firstName || user.lastName) && !user.id) {
          return interval$.pipe(
            takeUntil(timer$),
            switchMap(() => this.authQuery.select().pipe(
              map(el => el && el.id !== null)
            )),
            tap(() => lap++)
          );
        } else {
          return of(null);
        }

      }),
      tap(auth => {
        if (auth) {
          lap = 0;
          nullOrValidSubs.unsubscribe();
        }
        if (lap === 5) {
          lap = 0;
          this.userService.resetStore();
          this.authService.resetStore();
          this.manageService.setGeneralModal(true);
        }
      })
    ).subscribe();
    this.storeSubs.push(nullOrValidSubs);
  }

  updateStores(auth: Auth) {
    this.worksiteService.setWorksiteStore(auth).subscribe();
    this.worktypeService.setWorkTypeStore(auth).subscribe();
    this.hoursService.setUserHours(auth).subscribe();
  }

  handleRoles(auth: Auth) {
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

  getAnimationData(outlet: RouterOutlet) {
    // tslint:disable-next-line: no-string-literal
    const routeData = outlet.activatedRouteData['animation'];
    if (!routeData) {
      return 'rootPage';
    }
    // tslint:disable-next-line: no-string-literal
    return routeData['page'];
  }

  closeModal() {
    this.manageService.setGeneralModal(false);
  }

  ngOnDestroy() {
    this.firebaseSubs.forEach(el => el.unsubscribe());
    this.storeSubs.forEach(el => el.unsubscribe());
  }
}
