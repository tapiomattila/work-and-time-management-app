import { Query } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { Auth } from './auth.model';
import { AuthStore } from './auth.store';

@Injectable({
    providedIn: 'root'
})
export class AuthQuery extends Query<Auth> {

    isAuthenticated$ = this.select(auth => auth.isAuthenticated);

    constructor(protected store: AuthStore) {
        super(store);
    }
}
