import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { User } from './users.model';

export interface UsersState extends EntityState<User, string> { }

const initialState = {
    users: []
};

@Injectable({
    providedIn: 'root'
})
@StoreConfig({
    name: 'users',
    resettable: true
})
export class UsersStore extends EntityStore<UsersState> {
    constructor() {
        super(initialState);
    }
}
