import { Injectable } from '@angular/core';
import { HoursStore } from './hours.store';
import { Hours, createHours } from './hours.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first } from 'rxjs/operators';
import { FireBaseCollectionsEnum } from 'src/app/enumerations/global.enums';

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

    fetchHours(userId: string) {
        return this.af.collection(`${FireBaseCollectionsEnum.USERS}/${userId}/${FireBaseCollectionsEnum.HOURS}`)
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
}
