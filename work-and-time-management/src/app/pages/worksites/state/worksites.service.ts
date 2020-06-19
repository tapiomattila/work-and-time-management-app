import { Injectable } from '@angular/core';
import { WorksiteStore } from './worksites.store';
import { Worksite, createWorksite } from './worksites.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first } from 'rxjs/operators';
import { FireBaseCollectionsEnum } from 'src/app/enumerations/global.enums';

@Injectable({
    providedIn: 'root'
})
export class WorksitesService {
    constructor(
        private worksitesStore: WorksiteStore,
        private af: AngularFirestore
    ) { }

    setWorksites(worksites: Partial<Worksite>[]) {
        const worksiteArray = new Array();
        worksites.forEach(el => {
            worksiteArray.push(createWorksite(el));
        });

        this.worksitesStore.set(worksiteArray);
    }

    setActive(id: string) {
        this.worksitesStore.setActive(id);
    }

    fetchAllWorksites() {
        return this.af.collection(FireBaseCollectionsEnum.WORKSITES)
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
