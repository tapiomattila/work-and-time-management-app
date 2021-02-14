import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FireBaseCollectionsEnum } from 'src/app/enumerations/global.enums';
import { first, map } from 'rxjs/operators';
import { UserStore } from './user.store';
import { createUser, User } from './user.model';
import { from, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(
        private userStore: UserStore,
        private af: AngularFirestore
    ) { }

    upsertUsersStore(id: string, user: Partial<User>) {
        this.userStore.upsert(id, user);
    }

    addUsersToStore(users: Partial<User>[]) {
        const userArray = new Array();
        users.forEach(el => {
            userArray.push(createUser(el));
        });
        this.userStore.add(userArray);
    }

    fetchWhiteListUser(id: string) {
        return this.af.collection(FireBaseCollectionsEnum.WHITELISTED).doc(id)
            .snapshotChanges()
            .pipe(
                map((snap: any) => {
                    return {
                        id: snap.payload.id,
                        ...(snap.payload.data() as object)
                    };
                }),
                first()
            );
    }

    fetchUserById222(id: string) {
        return this.af.collection(FireBaseCollectionsEnum.USERS).doc(id)
            .snapshotChanges()
            .pipe(
                map((snap: any) => {
                    return {
                        id: snap.payload.id,
                        ...(snap.payload.data() as object)
                    };
                }),
                first()
            );
    }

    fetchUserById(user: { clientId: string, email: string, id: string }) {
        const query = this.af.collection(FireBaseCollectionsEnum.USERS,
            ref => ref
                .where('userId', '==', user.id)
                .where('clientId', '==', user.clientId)
        );
        return query.snapshotChanges()
            .pipe(
                map((snaps: any) => {
                    return snaps.map(snap => {
                        return {
                            id: snap.payload.doc.id,
                            ...snap.payload.doc.data()
                        };
                    });
                }),
                map(snaps => snaps.length > 0 ? snaps[0] : null),
                first()
            );
    }

    fetchAllUsersByClientId(clientId: string) {
        const query = this.af.collection(FireBaseCollectionsEnum.USERS,
            ref => ref
                .where('clientId', '==', clientId)
        );
        return query.snapshotChanges()
            .pipe(
                map((snaps: any) => {
                    return snaps.map(snap => {
                        return {
                            id: snap.payload.doc.id,
                            ...snap.payload.doc.data()
                        };
                    });
                }),
                first()
            );
    }

    postNewUser(user: Partial<User>) {
        if (!user.userId && !user.clientId) {
            return of(false);
        }

        return from(this.af.collection(`${FireBaseCollectionsEnum.USERS}`).add(user))
            .pipe(
                map((snap: any) => {
                    return {
                        id: snap.payload.id,
                        ...(snap.payload.data() as object)
                    };
                }),
                first()
            );
    }


    resetAllStores() {
        this.userStore.reset();
        // this.worksiteService.resetStore();
        // this.hourService.resetStore();
    }

    resetStore() {
        this.userStore.reset();
    }

    takeSnap() {

    }
}
