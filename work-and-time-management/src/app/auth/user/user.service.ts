import { UserStore } from './user.store';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first, tap } from 'rxjs/operators';
import { User, createUser } from './user.model';
import { FireBaseCollectionsEnum } from 'src/app/enumerations/global.enums';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(
        private userStore: UserStore,
        private af: AngularFirestore
    ) { }

    // updateUser(userId: string, firstN: string, last: string) {
    updateUser(user: Partial<User>) {

        // this.userStore.update({ id: userId, firstName: firstN, lastName: last });
        this.userStore.update(createUser(user));
    }

    fetchAllUsers() {
        return this.af.collection(FireBaseCollectionsEnum.USERS)
            .snapshotChanges()
            .pipe(
                map(snaps => {
                    return snaps.map(snap => {
                        const id = snap.payload.doc.id;
                        const data = snap.payload.doc.data();
                        return {
                            id,
                            ...(data as object)
                        };
                    });

                }),
                first()
            );
    }

    // updateUserStore() {
    //     this.fetchAllUsers().pipe(
    //         tap((users: User[]) => {
    //             this.updateUser(users[0].id, users[0].firstName, users[0].lastName);
    //         })
    //     ).subscribe();
    // }
    resetStore() {
        this.userStore.reset();
    }
}
