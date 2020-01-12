import { UserStore } from './user.store';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(private userStore: UserStore) { }

    updateUser(userId: string, newName: string) {
        this.userStore.update({ id: userId, name: newName });
    }
}
