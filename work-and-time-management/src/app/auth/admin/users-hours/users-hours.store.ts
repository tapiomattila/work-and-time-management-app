import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { UserHours } from './users-hours.model';

export interface UsersHoursState extends EntityState<UserHours, string> { }

const initialState = {
    usersHours: []
};

@Injectable({
    providedIn: 'root'
})
@StoreConfig({
    name: 'users-hours',
    resettable: true
})
export class UsersHoursStore extends EntityStore<UsersHoursState> {
    constructor() {
        super(initialState);
    }
}
