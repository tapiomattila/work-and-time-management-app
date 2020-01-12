import { Query } from '@datorama/akita';
import { User } from './user.model';
import { UserStore } from './user.store';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UserQuery extends Query<User> {
    user$ = this.select();
    constructor(protected store: UserStore) {
        super(store);
    }
}
