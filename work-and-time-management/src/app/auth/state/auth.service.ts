import { Injectable } from '@angular/core';
import { AuthStore } from './auth.store';
import { Auth, createAuth } from './auth.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { distinctUntilChanged, map, switchMap, tap } from 'rxjs/operators';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { Observable, of } from 'rxjs';
import { UserQuery } from '../user';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    loader = false;

    constructor(
        private authStore: AuthStore,
        private afAuth: AngularFireAuth,
        private userService: UserService,
        private userQuery: UserQuery
    ) { }

    firebaseAuthUpdate(): Observable<boolean> {
        return this.afAuth.authState.pipe(
            distinctUntilChanged(),
            tap((authenticated: firebase.User) => {
                console.log('show authenticated', authenticated);
                this.loader = false;
                const isAuth = !!authenticated;

                if (isAuth) {
                    this.initialUpdateUser(authenticated);
                }
            }),
            switchMap((auth: any) => auth && auth.uid ? this.userService.fetchUserById(auth.uid) : of(null)),
            map((user: Partial<User>) => {
                if (user && user._c !== undefined) {
                    this.updateAuthStateWithData(user);
                    this.updateUserWithClientId(user);
                    this.postUserData(user);
                    return !!user;
                }
                return false;
            }),
        );
    }

    updateAuthStateWithData(user: Partial<User>) {
        const authState: Auth = {
            id: user.id,
            isAuthenticated: !!user,
            clientId: user._c
        };
        this.updateAuthState(authState);
    }

    initialUpdateUser(authenticated: firebase.User) {
        const nameArr = authenticated.displayName.split(' ');
        const firstName = nameArr[0] ? nameArr[0] : null;
        const lastName = nameArr[1] ? nameArr[1] : null;
        const user: User = {
            id: null,
            firstName,
            lastName,
            displayName: authenticated.displayName,
            isAdmin: false,
            isManager: false,
            email: authenticated.email,
            profilePictureUrl: authenticated.photoURL,
            _c: null
        };
        this.userService.updateUser(user);
    }

    updateUserWithClientId(user: Partial<User>) {
        const userUpdate: Partial<User> = {
            id: user.id,
            isAdmin: user.isAdmin,
            isManager: user.isManager,
            _c: user._c
        };
        this.userService.updateUser(userUpdate);
    }

    postUserData(user: Partial<User>) {
        const userGet = this.userQuery.getValue();
        const postUser = {
            firstName: userGet.firstName,
            lastName: userGet.lastName,
            email: userGet.email,
        };
        this.userService.postUser(user.id, postUser).subscribe();
    }

    updateAuthState(authState: Partial<Auth>) {
        this.authStore.update(createAuth(authState));
    }

    signOut() {
        this.userService.resetAllStores();
        this.authStore.reset();
        // this.afAuth.auth.signOut();
    }

    resetStore() {
        this.authStore.reset();
    }
}
