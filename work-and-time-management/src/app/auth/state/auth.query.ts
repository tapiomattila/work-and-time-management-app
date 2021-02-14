import { Query } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { Auth } from './auth.model';
import { AuthStore } from './auth.store';
// import { UserQuery } from '../user';
import { map, switchMap, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { User, UserQuery } from 'src/app/stores/users';

@Injectable({
    providedIn: 'root'
})
export class AuthQuery extends Query<Auth> {

    isAuthenticated$ = this.select(auth => auth.isAuthenticated);
    auth$ = this.select();

    constructor(
        protected store: AuthStore,
        private userQuery: UserQuery,
    ) {
        super(store);
    }

    selectSignedInUser(): Observable<User> {
        return this.auth$.pipe(
            switchMap(auth => auth && auth.id ? this.userQuery.selectUserById(auth.id) : of(null))
        );
    }

    getSignedInUser() {
        const authUser = this.getValue();
        const userById = this.userQuery.getUserById(authUser.id);
        return userById;
    }

    getUserRoles() {
        const user = this.userQuery.getAll().filter(el => el.userId === this.getValue().id);
        return user[0].roles;
    }
}
