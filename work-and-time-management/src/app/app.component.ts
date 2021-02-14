import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { WindowService } from './services/window.service';
import { NavigationHandlerService } from './services/navigation-handler.service';
import { WorksitesService } from './stores/worksites/state';
import { AuthQuery, AuthService } from './auth/state';
import { WorkTypeService } from './stores/worktypes/state';
import { switchMap, tap } from 'rxjs/operators';
import { trigger, transition, style, animate } from '@angular/animations';
import { ManageService } from './pages/manage.service';
import { HoursQuery, HoursService } from './stores/hours';
import { User, UserQuery, UserService } from './stores/users';

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
    private hoursQuery: HoursQuery,
    private userService: UserService,
    private authQuery: AuthQuery,
    public manageService: ManageService,
    public authService: AuthService,
    public navigationHandlerService: NavigationHandlerService,
    public windowService: WindowService,
  ) { }

  ngOnInit() {
    this.authService.loader = true;
    this.authenticatedUserStoreUpdate();
    this.user$ = this.authQuery.selectSignedInUser();

    const worksiteSub = this.user$.pipe(
      switchMap(user => user && user.id ? this.worksiteService.fetchUserWorksites22(user) : of(null)),
      tap(worksites => {
        // TODO
        // normal user: fetch user worksites, and update store
        // if admin/manager, fetch all worksites, update store
        // query store for signed in user or selected user worksites

        if (worksites) {
          this.worksiteService.setWorksites(worksites);
        }

      })
    ).subscribe();

    const worktypeSub = this.user$.pipe(
      switchMap((user: User) => user && user.id ? this.worktypeService.fetchWorkTypes22(user) : of(null)),
      tap(res => {
        if (this.doesArrayExist(res)) {
          this.worktypeService.setWorkTypes(res);
        }
      })
    ).subscribe();

    const hoursSub = this.user$.pipe(
      switchMap((user: User) => user && user.id ? this.hoursService.fetchHours22(user) : of(null)),
      tap(res => {
        if (this.doesArrayExist(res)) {
          this.hoursService.setHours(res);
        }
      })
    ).subscribe();

    this.storeSubs.push(worksiteSub);
    this.storeSubs.push(worktypeSub);
    this.storeSubs.push(hoursSub);
  }

  authenticatedUserStoreUpdate() {
    const authSubs = this.authService.firebaseAuthUpdate().pipe(
      tap((user: any) => {
        if (user) {
          const userMod = user as User;
          this.userService.upsertUsersStore(userMod.userId, userMod);
        }
      })
    ).subscribe();
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
