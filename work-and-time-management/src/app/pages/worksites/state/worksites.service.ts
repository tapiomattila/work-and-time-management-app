import { Injectable } from '@angular/core';
import { WorksiteStore } from './worksites.store';
import { Worksite, createWorksite } from './worksites.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first, tap } from 'rxjs/operators';
import { FireBaseCollectionsEnum } from 'src/app/enumerations/global.enums';
import { Observable, from } from 'rxjs';

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

    setWorksiteStore(userId: string) {
        return this.fetchUserWorksites(userId)
            .pipe(
                tap(res => {
                    if (res && res.length) {
                        this.setWorksites(res);
                    }
                }),
            );
    }

    fetchUserWorksites(userId: string) {
        return this.af.collection(`${FireBaseCollectionsEnum.WORKSITES}`)
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
                map((worksites: Worksite[]) => {
                    return worksites.filter(el => {
                        if (el.users && el.users.includes(userId)) {
                            return el;
                        }
                    });
                }),
                // first()
            );
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

    fetchWorksiteById(id: string) {
        return this.af.collection(FireBaseCollectionsEnum.WORKSITES).doc(id)
            .snapshotChanges()
            .pipe(
                map(snap => {
                    return { id: snap.payload.id, data: snap.payload.data() };
                }),
                first()
            );
    }

    putWorksite(id: string, changes: Partial<Worksite>): Observable<any> {
        return from(this.af.doc(`${FireBaseCollectionsEnum.WORKSITES}/${id}`).update(changes));
    }

    updateWorksite(worksite: Worksite, updated: Partial<Worksite>): void {
        this.worksitesStore.update(worksite.id,
            {
                ...worksite,
                updatedAt: updated.updatedAt,
                nickname: updated.nickname,
                streetAddress: updated.streetAddress,
                postalCode: updated.postalCode,
                city: updated.city,
                deleted: updated.deleted
            });
    }

    updateDeleted(worksite: Worksite, changes: {
        updatedAt: string,
        updatedBy: string,
        deleted: true
    }) {
        this.worksitesStore.update(worksite.id,
            {
                ...worksite,
                deleted: changes.deleted,
                updatedAt: changes.updatedAt,
                updatedBy: changes.updatedBy
            });
    }

    postNewWorksite(worksite: Partial<Worksite>) {
        return from(this.af.collection(`${FireBaseCollectionsEnum.WORKSITES}`).add(worksite));
    }

    addNewWorksiteToStore(worksite: Partial<Worksite>, id: string) {
        worksite.id = id;
        const newWorksite = createWorksite(worksite);
        this.worksitesStore.add(newWorksite);
    }

    resetStore() {
        this.worksitesStore.reset();
    }
}
