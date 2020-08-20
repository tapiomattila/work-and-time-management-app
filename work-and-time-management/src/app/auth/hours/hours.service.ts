import { Injectable } from '@angular/core';
import { HoursStore } from './hours.store';
import { Hours, createHours } from './hours.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first, tap } from 'rxjs/operators';
import { FireBaseCollectionsEnum } from 'src/app/enumerations/global.enums';
import { from, Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class HoursService {
    constructor(
        private hoursStore: HoursStore,
        private af: AngularFirestore
    ) { }

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

    setUserHours(userId: string) {
        return this.fetchHours(userId)
            .pipe(
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
        return from(this.af.collection(`${FireBaseCollectionsEnum.HOURS}`).add(hours));
    }

    updateHours(hours: Hours, updated: Partial<Hours>) {
        this.hoursStore.update(hours.id,
            {
                ...hours,
                updatedAt: updated.updatedAt,
                markedHours: updated.markedHours,
                worksiteId: updated.worksiteId,
                worktypeId: updated.worktypeId
            });
    }

    removeHours(id: string) {
        this.hoursStore.remove(id);
    }

    deleteHours(id: string) {
        return from(this.af.doc(`${FireBaseCollectionsEnum.HOURS}/${id}`).delete());
    }

    resetStore() {
        this.hoursStore.reset();
    }

    fetchHours(userId: string) {
        return this.af.collection(`${FireBaseCollectionsEnum.HOURS}`, ref => ref.where('userId', '==', userId))
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

    putHours(id: string, changes: Partial<Hours>): Observable<any> {
        return from(this.af.doc(`${FireBaseCollectionsEnum.HOURS}/${id}`).update(changes));
    }

}
