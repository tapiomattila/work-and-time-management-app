import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Observable, of, Subscription } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
// import { Users } from 'src/app/auth/admin/users/users.model';
// import { UsersQuery } from 'src/app/auth/admin/users/users.query';
// import { UsersService } from 'src/app/auth/admin/users/users.service';
import { AuthQuery } from 'src/app/auth/state';
// import { UserService } from 'src/app/auth/user';
import { Auth } from 'src/app/auth/state';
// import { HoursQuery } from 'src/app/auth/hours';
import { Router } from '@angular/router';
import { RouterRoutesEnum } from 'src/app/enumerations/global.enums';
import { User, UserQuery } from 'src/app/stores/users';
import { HoursQuery } from 'src/app/stores/hours';

@Component({
    selector: 'app-manage-users',
    templateUrl: './manage-users.component.html',
    styleUrls: ['./manage-users.component.scss'],
})
export class ManageUsersComponent implements OnInit, OnDestroy {
    loading$: Observable<boolean>;

    private subscriptions: Subscription[] = [];
    users$: Observable<{
        monthHours$: Observable<any>,
        totalHours$: Observable<number>,
        user: User
    }[]>;

    constructor(
        // private usersService: UsersService,
        // private userService: UserService,
        // private usersQuery: UsersQuery,
        // private authQuery: AuthQuery,
        // private hoursQurery: HoursQuery,
        // private router: Router
        private userQuery: UserQuery,
        private hourQuery: HoursQuery
    ) { }

    ngOnInit() {
        console.log('manage users');
        this.loading$ = this.userQuery.selectLoading();

        // this.userQuery.selectAll().subscribe(res => console.log('show users', res));
        // this.userQuery.selectLoading().subscribe(res => console.log('shwo loading', res));
        // this.userQuery.users$.subscribe(res => console.log('users$: ', res));

        // TODO: fetching hours data is now working on only for signed in user. For admin it should be
        //       for fetching all hours for all users

        this.users$ = this.userQuery.users$.pipe(
            map(el => {
                return el.map(elx => {
                    return {
                        monthHours$: this.hourQuery.selectHoursForCurrentMonth(elx.userId),
                        totalHours$: this.hourQuery.selectTotalHoursByUser(elx.userId),
                        user: elx
                    };
                });
            }),
        );

        // this.hourQuery.selectHoursForCurrentMonth('OAvE84ZS3V1Xkrg3r6q8').subscribe(res => console.log('show res', res));
        // this.hourQuery.selectTotalHoursByUser('OAvE84ZS3V1Xkrg3r6q8').subscribe(res => console.log('show res', res));
        // this.hourQuery.selectTotalHoursByUser('LGyd6FH36jZ5u38FzStA').subscribe(res => console.log('show res', res));

        // this.users$.subscribe(res => {
        //     if (res && res[0]) {
        //         console.log('res[0]', res[0]);
        //         res[0].monthHours$.subscribe(res3 => console.log(res3));
        //         // res[0].monthHours$.subscribe(res2 => {
        //         //     console.log('show res in month', res2);
        //         // });
        //     }
        // });

        // this.users$ = this.usersQuery.users$.pipe(
        //   map(el => {
        //     return el.map(elx => {
        //       return {
        //         monthHours$: this.hoursQurery.selectHoursForCurrentMonth(elx.id),
        //         totalHours$: this.hoursQurery.selectTotalHoursByUser(elx.id),
        //         user: elx
        //       };
        //     });
        //   })
        // );
        // const usersStoreOrFetchSubs = this.authQuery.auth$
        //   .pipe(
        //     switchMap((authen: Auth) => {
        //       if (authen.clientId) {
        //         return this.usersQuery.users$.pipe(
        //           switchMap(res => {
        //             if (res.length > 0) {
        //               return of(res);
        //             } else {
        //               return this.userService.fetchAllUsersInfos(authen).pipe(
        //                 tap((users: Users[]) => {
        //                   this.usersService.updateUsersStore(users);
        //                 })
        //               );
        //             }
        //           })
        //         );
        //       } else {
        //         return of([]);
        //       }
        //     })
        //   ).subscribe();
        // this.subscriptions.push(usersStoreOrFetchSubs);
    }

    // openUser(user) {
    //   this.router.navigate([RouterRoutesEnum.USER_MANAGEMENT, user.user.id]);
    // }

    ngOnDestroy() {
        // this.subscriptions.forEach(el => el.unsubscribe());
    }
}
