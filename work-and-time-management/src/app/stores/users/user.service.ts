import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FireBaseCollectionsEnum } from 'src/app/core/enums/global.enums';
import { first, map, tap } from 'rxjs/operators';
import { UserStore } from './user.store';
import { createUser, User } from './user.model';
import { from, Observable, of } from 'rxjs';
import { mapSnaps, takeSnap } from 'src/app/core/helpers/helper-functions';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    constructor(private userStore: UserStore, private af: AngularFirestore) {}

    upsertUsersStore(id: string, user: Partial<User>) {
        this.userStore.upsert(id, user);
    }

    setStore(user: User) {
        this.userStore.set([user]);
    }

    updateStore(id: string, user: Partial<User>) {
        this.userStore.update(id, user);
    }

    addUsers(users: Partial<User>[]) {
        const userArray = new Array();
        users.forEach(el => {
            userArray.push(createUser(el));
        });
        this.userStore.add(userArray);
    }

    fetchWhiteListUser(id: string) {
        return this.af
            .collection(FireBaseCollectionsEnum.WHITELISTED)
            .doc(id)
            .snapshotChanges()
            .pipe(
                map((snap: any) => {
                    return takeSnap(snap);
                }),
                first()
            );
    }

    fetchUserById(user: { clientId: string; email: string; id: string }) {
        const query = this.af.collection(FireBaseCollectionsEnum.USERS, ref =>
            ref
                .where('userId', '==', user.id)
                .where('clientId', '==', user.clientId)
        );
        return query.snapshotChanges().pipe(
            map((snaps: any) => {
                return mapSnaps(snaps);
            }),
            map(snaps => (snaps.length > 0 ? snaps[0] : null)),
            first()
        );
    }

    fetchAllUsersByClientId(clientId: string): Observable<User[]> {
        const query = this.af.collection(FireBaseCollectionsEnum.USERS, ref =>
            ref.where('clientId', '==', clientId)
        );
        return query.snapshotChanges().pipe(
            map((snaps: any) => {
                return mapSnaps(snaps);
            }),
            first()
        );
    }

    postNewUser(user: Partial<User>) {
        if (!user.userId && !user.clientId) {
            return of(false);
        }

        return from(
            this.af.collection(`${FireBaseCollectionsEnum.USERS}`).add(user)
        ).pipe(
            map((snap: any) => {
                return takeSnap(snap);
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
}
