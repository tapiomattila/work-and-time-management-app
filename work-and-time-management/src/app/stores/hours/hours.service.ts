import { Injectable } from '@angular/core';
import { HoursStore } from './hours.store';
import { Hours, createHours } from './hours.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first, tap, delay, switchMap, filter } from 'rxjs/operators';
import { FireBaseCollectionsEnum } from 'src/app/enumerations/global.enums';
import { from, Observable, of } from 'rxjs';
import { Auth } from '../../auth/state';
import { User } from '../users';
import {
    doesArrayExist,
    mapSnapsWithId,
} from 'src/app/helpers/helper-functions';

@Injectable({
    providedIn: 'root',
})
export class HoursService {
    constructor(private hoursStore: HoursStore, private af: AngularFirestore) {}

    setActive(id: string) {
        this.hoursStore.setActive(id);
    }

    setHours(hours: Partial<Hours>[]) {
        const hoursArray = new Array();
        hours.forEach(el => {
            hoursArray.push(createHours(el));
        });

        this.hoursStore.set(hoursArray);
    }

    setUserHours(user: User) {
        return this.fetchHours(user).pipe(
            tap(hours => {
                if (hours && hours.length) {
                    this.setHours(hours);
                }
            })
        );
    }

    setAllHours(auth: Auth) {
        return this.fetchAllUsersHours(auth).pipe(
            tap(hours => {
                if (hours && hours.length) {
                    this.setHours(hours);
                }
            })
        );
    }

    convertSecondsToDate(seconds: number) {
        const d = new Date(0); // The 0 there is the key, which sets the date to the epoch
        return d.setUTCSeconds(seconds);
    }

    postNewHours(hours: Partial<Hours>) {
        return from(
            this.af.collection(`${FireBaseCollectionsEnum.HOURS}`).add(hours)
        );
    }

    updateHours(hours: Hours, updated: Partial<Hours>) {
        this.hoursStore.update(hours.id, {
            ...hours,
            updatedAt: updated.updatedAt,
            marked: updated.marked,
            worksiteId: updated.worksiteId,
            worksiteName: updated.worksiteName,
            worktypeId: updated.worktypeId,
            worktypeName: updated.worktypeName,
        });
    }

    removeHours(id: string) {
        this.hoursStore.remove(id);
    }

    deleteHours(id: string) {
        return from(
            this.af.doc(`${FireBaseCollectionsEnum.HOURS}/${id}`).delete()
        );
    }

    resetStore() {
        this.hoursStore.reset();
    }

    fetchHours(user: User) {
        return this.af
            .collection(`${FireBaseCollectionsEnum.HOURS}`, ref =>
                ref
                    .where('userId', '==', user.userId)
                    .where('clientId', '==', user.clientId)
            )
            .snapshotChanges()
            .pipe(
                delay(1000),
                map(snaps => {
                    return mapSnapsWithId(snaps);
                }),
                first()
            );
    }

    fetchUserHours(user$: Observable<User>) {
        return user$.pipe(
            switchMap((user: User) =>
                user && user.id ? this.fetchHours(user) : of(null)
            ),
            tap(res => {
                if (doesArrayExist(res)) {
                    this.setHours(res);
                }
            })
        );
    }

    putHours(id: string, changes: Partial<Hours>): Observable<any> {
        return from(
            this.af
                .doc(`${FireBaseCollectionsEnum.HOURS}/${id}`)
                .update(changes)
        );
    }

    fetchAllUsersHours(auth: Auth) {
        return this.af
            .collection(`${FireBaseCollectionsEnum.HOURS}`, ref =>
                ref.where('clientId', '==', auth.clientId)
            )
            .snapshotChanges()
            .pipe(
                delay(1000),
                map(snaps => {
                    return mapSnapsWithId(snaps);
                }),
                first()
            );
    }
}
