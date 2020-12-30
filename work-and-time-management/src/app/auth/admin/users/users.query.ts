import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { UsersState, UsersStore } from './users.store';
import { filter, take } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UsersQuery extends QueryEntity<UsersState> {
    users$ = this.selectAll();
    constructor(
        protected store: UsersStore
    ) {
        super(store);
    }

    getAllUsers() {
        return this.getAll();
    }

    selectUserById(id: string) {
        return this.selectAll({
            filterBy: entity => entity.id === id
          });
    }
}
