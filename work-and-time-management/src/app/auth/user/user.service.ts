import { UserStore } from './user.store';
import { Injectable } from '@angular/core';
import { first } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private userStore: UserStore) { }

    updateUser(userId: string, first: string, last: string) {
        this.userStore.update({ id: userId, firstName: first, lastName: last });
    }
}
