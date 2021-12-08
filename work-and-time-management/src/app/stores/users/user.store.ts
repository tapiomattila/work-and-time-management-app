import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { User } from './user.model';

export interface UserState extends EntityState<User, string> {}

const initialState = {
    users: [],
};

@Injectable({
    providedIn: 'root',
})
@StoreConfig({
    name: 'users',
    resettable: true,
})
export class UserStore extends EntityStore<UserState> {
    constructor() {
        super(initialState);
    }
}
