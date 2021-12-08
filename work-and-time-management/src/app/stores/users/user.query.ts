import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { UserState, UserStore } from './user.store';
import { map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class UserQuery extends QueryEntity<UserState> {
    users$ = this.selectAll();
    constructor(protected store: UserStore) {
        super(store);
    }

    selectUserByUserId(id: string) {
        return this.selectAll({
            filterBy: entity => entity.userId === id,
        }).pipe(map(els => (els.length > 0 ? els[0] : null)));
    }

    getAllUsers() {
        return this.getAll();
    }

    getUserById(id: string) {
        return this.getAll().find(el => el.userId === id);
    }
}
