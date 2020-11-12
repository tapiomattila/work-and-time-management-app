import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserHours, createUserHours } from './users-hours.model';
import { UsersHoursStore } from './users-hours.store';

@Injectable({
    providedIn: 'root'
})
export class UsersHoursService {
    constructor(
        private usersHoursStore: UsersHoursStore,
        private af: AngularFirestore
    ) { }

    setUsersHours(usersHours: Partial<UserHours>[]) {
        const userHoursArray = new Array();
        usersHours.forEach(el => {
            userHoursArray.push(createUserHours(el));
        });

        this.usersHoursStore.set(userHoursArray);
    }

    resetStore() {
        this.usersHoursStore.reset();
    }
}
