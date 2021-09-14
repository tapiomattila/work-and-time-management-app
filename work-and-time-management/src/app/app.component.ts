import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { WindowService } from './services/window.service';
import { NavigationHandlerService } from './services/navigation-handler.service';
import { Worksite, WorksitesService } from './stores/worksites/state';
import { AuthQuery, AuthService } from './auth/state';
import { WorkTypeService } from './stores/worktypes/state';
import { switchMap, tap } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';
import { ManageService } from './pages/manage.service';
import { HoursService } from './stores/hours';
import { User, UserQuery } from './stores/users';
import { Role } from './enumerations/global.enums';

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

  /*
  ROLES:
  admin:
    - CRUD worksites (done)
    - CRUD worktypes (done)
    - see all users, assign users to worksites (done)
    - assign hours to any user (by own client id)
    - see all users hours
    - analytics for the data
  manager:
    - read worksites (done)
    - read worktypes (done)
    - see all users, assign users to own worksites (done)
    - assign hours to own user (done)
    - analytics for own user
  basic:
    - read worksites (done)
    - read worktypes (done)
    - assign hours to own user (done)
    - analytics for own user
   */

  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.windowService.updateCurrentDimensions(window.innerWidth, window.innerHeight);
  }

  constructor(
    private worksiteService: WorksitesService,
    private worktypeService: WorkTypeService,
    private hoursService: HoursService,
    private authQuery: AuthQuery,
    private userQuery: UserQuery,
    public manageService: ManageService,
    public authService: AuthService,
    public navigationHandlerService: NavigationHandlerService,
    public windowService: WindowService,
  ) { }

  ngOnInit() {
    this.authService.loader = true;
    this.authenticatedUserStoreUpdate();
    this.user$ = this.authQuery.selectSignedInUser();

    const accessWorksitesSub = this.user$.pipe(
      switchMap((user: User) => {
        const access = user && user.id && (user.roles.includes(Role.ADMIN) || user.roles.includes(Role.MANAGER));
        return access ? this.worksiteService.fetchAllClientWorksites(user.clientId) : of(null);
      }),
      tap((worksites: Worksite[]) => {
        if (worksites) {
          this.worksiteService.setWorksites(worksites);
        }
      }),
      switchMap(() => this.user$),
      switchMap((user: User) => {
        const access = user && user.id;
        return access ? this.worksiteService.fetchUserWorksites(user) : of(null);
      }),
      tap((worksites: Worksite[]) => {
        if (worksites) {
          this.worksiteService.setWorksites(worksites);
        }
      })
    ).subscribe();

    const worktypeSub = this.user$.pipe(
      switchMap((user: User) => user && user.id ? this.worktypeService.fetchWorkTypes(user) : of(null)),
      tap(res => {
        if (this.doesArrayExist(res)) {
          this.worktypeService.setWorkTypes(res);
        }
      })
    ).subscribe();

    const hoursSub = this.user$.pipe(
      switchMap((user: User) => user && user.id ? this.hoursService.fetchHours(user) : of(null)),
      tap(res => {
        if (this.doesArrayExist(res)) {
          this.hoursService.setHours(res);
        }
      })
    ).subscribe();

    this.storeSubs.push(accessWorksitesSub);
    this.storeSubs.push(worktypeSub);
    this.storeSubs.push(hoursSub);
  }

  authenticatedUserStoreUpdate() {
    const authSubs = this.authService.firebaseAuthUpdate().subscribe();
    this.firebaseSubs.push(authSubs);
  }

  closeModal() {
    this.manageService.setGeneralModal(false);
  }

  doesArrayExist(array: any[]) {
    return array && array.length > 0;
  }

  ngOnDestroy() {
    this.firebaseSubs.forEach(el => el.unsubscribe());
    this.storeSubs.forEach(el => el.unsubscribe());
  }
}
