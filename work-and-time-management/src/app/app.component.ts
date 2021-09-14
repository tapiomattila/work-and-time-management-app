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
import { User } from './stores/users';

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

    const adminUserWorksitesSub = this.user$.pipe(
      switchMap((user: User) => {
        const adminUser = user && user.id && user.roles.includes('admin');
        return adminUser ? this.worksiteService.fetchAllClientWorksites(user.clientId) : of(null);
      }),
      tap((worksites: Worksite[]) => {
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
      switchMap((user: User) => user && user.id ? this.hoursService.fetchHours(user) : of(null)),
      tap(res => {
        if (this.doesArrayExist(res)) {
          this.hoursService.setHours(res);
        }
      })
    ).subscribe();

    this.storeSubs.push(adminUserWorksitesSub);
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
