import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable, of, Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Users } from 'src/app/auth/admin/users/users.model';
import { UsersQuery } from 'src/app/auth/admin/users/users.query';
import { UsersService } from 'src/app/auth/admin/users/users.service';
import { AuthQuery } from 'src/app/auth/state';
import { UserService } from 'src/app/auth/user';
import { Auth } from 'src/app/auth/state';
import { HoursQuery } from 'src/app/auth/hours';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent implements OnInit, OnDestroy {
  loading$: Observable<boolean>;

  private subscriptions: Subscription[] = [];
  users$: Observable<{
    totalHours$: Observable<number>,
    user: Users
  }[]>;

  constructor(
    private usersService: UsersService,
    private userService: UserService,
    private usersQuery: UsersQuery,
    private authQuery: AuthQuery,
    private hoursQurery: HoursQuery
  ) { }

  ngOnInit() {
    this.loading$ = this.usersQuery.selectLoading();
    this.users$ = this.usersQuery.users$.pipe(
      map(el => {
        return el.map(elx => {
          return {
            monthHours$: this.hoursQurery.selectHoursForCurrentMonth(elx.id),
            totalHours$: this.hoursQurery.selectTotalHoursByUser(elx.id),
            user: elx
          };
        });
      })
    );

    const usersStoreOrFetchSubs = this.authQuery.auth$
      .pipe(
        switchMap((authen: Auth) => {
          if (authen.clientId) {

            return this.usersQuery.users$.pipe(
              switchMap(res => {
                if (res.length > 0) {
                  return of(res);
                } else {
                  return this.userService.fetchAllUsersInfos(authen).pipe(
                    tap((users: Users[]) => {
                      this.usersService.updateUsersStore(users);
                    })
                  );
                }
              })
            );

          } else {
            return of([]);
          }
        })
      ).subscribe();
    this.subscriptions.push(usersStoreOrFetchSubs);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(el => el.unsubscribe());
  }
}
