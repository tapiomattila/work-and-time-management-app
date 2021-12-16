import { Injectable } from '@angular/core';
import { AuthStore } from './auth.store';
import { Auth, createAuth } from './auth.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Observable, of, Subscription, timer } from 'rxjs';
import { User, UserService } from 'src/app/stores/users';
import { AuthQuery } from './auth.query';
import { ManageService } from 'src/app/pages/manage.service';
import { Role } from 'src/app/enumerations/global.enums';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    public subscriptions: Subscription[] = [];
    loader = false;

    constructor(
        private authStore: AuthStore,
        private authQuery: AuthQuery,
        private afAuth: AngularFireAuth,
        private userService: UserService,
        private manageService: ManageService
    ) { }

    // : Observable<boolean | Partial<User>[]>
    firebaseAuthUpdate(): Observable<{}> {
        return this.afAuth.authState.pipe(
            distinctUntilChanged(),
            tap((authenticated: firebase.User) => {
                this.loader = false;
                const isAuth = !!authenticated;

                if (isAuth) {
                    const authUser: Partial<Auth> = this.constructAuthUser(authenticated);
                    this.userNotFoundTimer();

                    // Initial auth state update
                    this.updateAuthState(authUser);
                }
            }),

            // fetch auth user from whitelisted users
            this.streamFetchWhiteListed(),

            // fetch whitelisted auth user from users collection
            this.streamFetchUserByIdAfterWhiteListed(),

            tap(user => {
                this.updateUserStore(user);
            }),

            this.handleAdminAllUsers(),
            this.handleNewUser()
        );
    }

    signOut() {
        this.userService.resetAllStores();
        this.authStore.reset();
        // this.afAuth.auth.signOut();
    }

    resetStore() {
        this.authStore.reset();
    }

    private updateUserStore(user: User) {
        if (user) {
            const usx = user as User;
            this.userService.upsertUsersStore(usx.id, usx);
        }
    }

    private constructAuthUser(authenticated: firebase.User) {
        // const authUser: Partial<Auth> =
        return {
            id: authenticated.uid,
            displayName: authenticated.displayName,
            email: authenticated.email,
            isAuthenticated: !!authenticated,
            profilePictureUrl: authenticated.photoURL,
        };
    }

    private handleAdminAllUsers() {
        return switchMap(() => {
            return this.authQuery
                .selectSignedInUser()
                .pipe(
                    switchMap((user: User) => {
                        if (this.checkRoleAllowed(user, [Role.ADMIN])) {
                            return this.userService.fetchAllUsersByClientId(
                                user.clientId
                            );
                        }
                        return of(null);
                    }),
                    tap((users: Partial<User>[]) => {
                        if (users) {
                            this.addUsersToUsersStore(users);
                        }
                    }),
                );
        });
    }

    // /**
    //  * Checks for registered user and if not present
    //  * show please register modal
    //  */
    private userNotFoundTimer() {
        const timer$ = timer(5000);
        const timerSub = timer$
            .pipe(
                switchMap(() => this.authQuery.selectSignedInUser()),
                tap(user =>
                    !user ? this.manageService.setGeneralModal(true) : false
                )
            ).subscribe();
        this.subscriptions.push(timerSub);
    }

    private handleNewUser() {
        return switchMap((user: {}) => {
            if (user) {
                return of(user);
            }
            const auth = this.authQuery.getValue();
            if (auth.isAuthenticated) {
                this.streamAfterAuthPostNewUser(auth);
            }
            return of(false);
        });
    }


    private updateAuthState(authState: Partial<Auth>) {
        this.authStore.update(createAuth(authState));
    }

    private streamFetchWhiteListed() {
        return switchMap((auth: firebase.User) =>
            auth && auth.uid
                ? this.userService.fetchWhiteListUser(auth.uid)
                : of(null)
        );
    }

    private streamFetchUserByIdAfterWhiteListed() {
        return switchMap(
            (user: { clientId: string; email: string; id: string }) => {
                if (user && user.clientId) {
                    this.updateAuthState({
                        id: user.id,
                        clientId: user.clientId,
                    });
                    return this.userService.fetchUserById(user);
                }
                return of(false);
            }
        );
    }

    private streamAfterAuthPostNewUser(auth: Auth) {
        const newUser = {
            userId: auth.id,
            clientId: auth.clientId,
            info: {
                email: auth.email,
                displayName: auth.displayName,
            },
            roles: [],
        };
        return this.userService.postNewUser(newUser);
    }

    private checkRoleAllowed(user: User, roles: string[]) {
        let allowed = false;
        roles.forEach(role => {
            if (user?.roles.includes(role)) {
                allowed = true;
            }
        });
        return allowed;
    }

    private addUsersToUsersStore(users: Partial<User>[]) {
        this.userService.addUsers(users);
    }

    private isAdminOrManager(user: User): boolean {
        return (
            user &&
            (user.roles.includes(Role.ADMIN) ||
                user.roles.includes(Role.MANAGER))
        );
    }

    private checkRoleForAdminOrManager() {
        const roleSubs = this.authQuery
            .selectSignedInUser()
            .pipe(
                switchMap((user: User) => {
                    if (this.isAdminOrManager(user)) {
                        return this.userService.fetchAllUsersByClientId(
                            user.clientId
                        );
                    }
                    return of(null);
                }),
                tap((users: Partial<User>[]) => {
                    if (users) {
                        this.addUsersToUsersStore(users);
                    }
                }),
            )
            .subscribe();
        this.subscriptions.push(roleSubs);
    }
}
