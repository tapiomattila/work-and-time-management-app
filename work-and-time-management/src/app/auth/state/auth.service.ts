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
    providedIn: 'root'
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

    firebaseAuthUpdate(): Observable<boolean> {
        return this.afAuth.authState.pipe(
            distinctUntilChanged(),
            tap((authenticated: firebase.User) => {
                this.loader = false;
                const isAuth = !!authenticated;

                if (isAuth) {
                    const authUser: Partial<Auth> = {
                        id: authenticated.uid,
                        displayName: authenticated.displayName,
                        email: authenticated.email,
                        isAuthenticated: !!authenticated,
                        profilePictureUrl: authenticated.photoURL
                    };
                    this.userNotFoundTimer();
                    this.checkAuthRole();

                    // Initial auth state update
                    this.updateAuthState(authUser);
                }
            }),

            // fetch auth user from whitelisted users
            this.streamFetchWhiteListed(),

            // fetch whitelisted auth user from users collection
            this.streamFetchUserByIdAfterWhiteListed(),


            switchMap(user => {
                if (user) {
                    return of(user);
                }
                const auth = this.authQuery.getValue();
                if (auth.isAuthenticated) {

                    // post new user to users collection if authenticated and whitelisted user
                    // is not found in that collection
                    this.streamAfterAuthPostNewUser(auth);
                }
                return of(false);
            }),
            tap(user => {
                if (user) {
                    const usx = user as User;
                    this.userService.upsertUsersStore(usx.id, usx);
                }
            })
        );
    }

    /**
     * Checks for registered user and if not present
     * show please register modal
     */
    userNotFoundTimer() {
        const timer$ = timer(5000);
        const timerSub = timer$.pipe(
            switchMap(() => this.authQuery.selectSignedInUser()),
            tap(user => !user ? this.manageService.setGeneralModal(true) : false),
        ).subscribe();
        this.subscriptions.push(timerSub);
    }

    private checkAuthRole() {
        const roleSubs = this.authQuery.selectSignedInUser()
            .pipe(
                switchMap((user: User) => {
                    if (this.isAdminOrManager(user)) {
                        return this.userService.fetchAllUsersByClientId(user.clientId);
                    }
                    return of(null);
                }),
                tap((users: Partial<User>[]) => {
                    if (users) {
                        this.addUsersToUsersStore(users);
                    }
                })
            ).subscribe();
        this.subscriptions.push(roleSubs);
    }

    updateAuthState(authState: Partial<Auth>) {
        this.authStore.update(createAuth(authState));
    }

    streamFetchWhiteListed() {
        return switchMap((auth: firebase.User) => auth && auth.uid ? this.userService.fetchWhiteListUser(auth.uid) : of(null));
    }

    streamFetchUserByIdAfterWhiteListed() {
        return switchMap((user: { clientId: string, email: string, id: string }) => {
            if (user && user.clientId) {
                this.updateAuthState({ id: user.id, clientId: user.clientId });
                return this.userService.fetchUserById(user);
            }
            return of(false);
        });
    }

    streamAfterAuthPostNewUser(auth: Auth) {
        const newUser = {
            userId: auth.id,
            clientId: auth.clientId,
            info: {
                email: auth.email,
                displayName: auth.displayName,
            },
            roles: []
        };
        return this.userService.postNewUser(newUser);
    }

    signOut() {
        this.userService.resetAllStores();
        this.authStore.reset();
        // this.afAuth.auth.signOut();
    }

    resetStore() {
        this.authStore.reset();
    }

    private isAdminOrManager(user: User): boolean {
        return user && (user.roles.includes(Role.ADMIN) || user.roles.includes(Role.MANAGER));
    }

    private addUsersToUsersStore(users: Partial<User>[]) {
        this.userService.addUsers(users);
    }
}
