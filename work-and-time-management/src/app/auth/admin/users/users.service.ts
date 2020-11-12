import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UsersStore } from './users.store';
import { createUser, User } from '../../user';
import { Auth } from '../../state';
import { FireBaseCollectionsEnum } from 'src/app/enumerations/global.enums';
import { delay, first, map, tap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UsersService {
    constructor(
        private usersStore: UsersStore,
        private af: AngularFirestore
    ) { }

    setUsers(users: Partial<User>[]) {
        const userArray = new Array();
        users.forEach(el => {
            userArray.push(createUser(el));
        });

        this.usersStore.set(userArray);
    }

    resetStore() {
        this.usersStore.reset();
    }

    updateUsersStore(users: Partial<User>[]) {
        this.setUsers(users);
    }
}
