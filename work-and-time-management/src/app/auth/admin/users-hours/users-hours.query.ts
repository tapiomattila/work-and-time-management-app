import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { UsersHoursState, UsersHoursStore } from './users-hours.store';

@Injectable({
    providedIn: 'root'
})
export class UsersHoursQuery extends QueryEntity<UsersHoursState> {
    usersHours$ = this.selectAll();
    constructor(
        protected store: UsersHoursStore
    ) {
        super(store);
    }
}
