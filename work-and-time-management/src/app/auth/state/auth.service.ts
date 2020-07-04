import { Injectable } from '@angular/core';
import { AuthStore } from './auth.store';
import { Auth, createAuth } from './auth.model';
import { AngularFireAuth } from '@angular/fire/auth';
import { map } from 'rxjs/operators';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(
        private authStore: AuthStore,
        private afAuth: AngularFireAuth,
        private userService: UserService
    ) { }

    firebaseAuthUpdate(): Observable<boolean> {
        return this.afAuth.authState.pipe(
            map(authenticated => {
                const isAuth = !!authenticated;

                if (isAuth) {
                    const authState: Auth = {
                        id: authenticated.uid,
                        isAuthenticated: isAuth
                    };

                    const nameArr = authenticated.displayName.split(' ');
                    const firstName = nameArr[0] ? nameArr[0] : null;
                    const lastName = nameArr[1] ? nameArr[1] : null;

                    const user: User = {
                        id: authenticated.uid,
                        firstName,
                        lastName,
                        displayName: authenticated.displayName,
                        isAdmin: false,
                        email: authenticated.email,
                        profilePictureUrl: authenticated.photoURL
                    };

                    this.updateAuthState(authState);
                    this.userService.updateUser(user);
                    return isAuth;
                } else {
                    return null;
                }
            })
        );
    }

    updateAuthState(authState: Partial<Auth>) {
        this.authStore.update(createAuth(authState));
    }

    signOut() {
        this.authStore.reset();
    }
}
