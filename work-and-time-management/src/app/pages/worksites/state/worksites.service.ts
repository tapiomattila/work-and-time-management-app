import { Injectable } from '@angular/core';
import { WorksiteStore } from './worksites.store';
import { Worksite, createWorksite } from './worksites.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first, tap, delay } from 'rxjs/operators';
import { FireBaseCollectionsEnum } from 'src/app/enumerations/global.enums';
import { Observable, from } from 'rxjs';
import { Auth } from 'src/app/auth/state';

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

    setWorksiteStore(auth: Auth) {
        return this.fetchUserWorksites(auth)
            .pipe(
                tap(res => {
                    if (res && res.length) {
                        this.setWorksites(res);
                    }
                }),
                first()
            );
    }

    setWorksiteStoreAdmin(auth: Auth) {
        return this.fetchAllClientWorksites(auth)
            .pipe(
                tap(res => {
                    if (res && res.length) {
                        this.setWorksites(res);
                    }
                }),
                first()
            );
    }

    fetchAllClientWorksites(auth: Auth) {
        const worksitesRef = this.af.collection<Worksite[]>(FireBaseCollectionsEnum.WORKSITES,
            ref => ref.where('_c', '==', auth.clientId)
        );

        return worksitesRef.snapshotChanges().pipe(
            delay(1000),
            map(snaps => {
                return snaps.map(snap => {
                    const id = snap.payload.doc.id;
                    const data = snap.payload.doc.data();
                    const worksite = {
                        id,
                        ...(data as object)
                    } as Worksite;
                    return worksite;
                });
            }),
            map(worksites => {
                return worksites.filter(el => {
                    if (el._c === auth.clientId) {
                        return el;
                    }
                });
            }),
            first()
        );
    }

    fetchUserWorksites(auth: Auth) {
        const worksitesRef = this.af.collection<Worksite[]>(FireBaseCollectionsEnum.WORKSITES,
            ref => ref.where('_c', '==', auth.clientId)
        );

        return worksitesRef.snapshotChanges().pipe(
            delay(1000),
            map(snaps => {
                return snaps.map(snap => {
                    const id = snap.payload.doc.id;
                    const data = snap.payload.doc.data();
                    const worksite = {
                        id,
                        ...(data as object)
                    } as Worksite;
                    return worksite;
                });
            }),
            map(worksites => {
                return worksites.filter(el => {
                    if (el && el.users.includes(auth.id) && el._c === auth.clientId) {
                        return el;
                    }
                });
            }),
            first()
        );
    }

    fetchAllWorksites() {
        return this.af.collection(FireBaseCollectionsEnum.WORKSITES)
            .snapshotChanges()
            .pipe(
                delay(1000),
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

    putWorksite(worksiteId: string, changes: Partial<Worksite>): Observable<any> {
        return from(this.af.doc(`${FireBaseCollectionsEnum.WORKSITES}/${worksiteId}`).update(changes));
    }

    updateWorksite(worksite: Worksite, updated: Partial<Worksite>): void {
        this.worksitesStore.update(worksite.id,
            {
                ...worksite,
                updatedAt: updated.updatedAt,
                name: updated.name,
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

    updateStoreWorksiteUsers(worksite: Worksite, newUsers: string[], type: 'add' | 'remove', updateById: string) {

        if (type === 'add') {
            this.worksitesStore.update(worksite.id,
                {
                    ...worksite,
                    updatedAt: new Date().toISOString(),
                    updatedBy: updateById,
                    users: newUsers
                });
        }

        if (type === 'remove') {
            this.worksitesStore.update(worksite.id, {
                ...worksite,
                updatedAt: new Date().toISOString(),
                updatedBy: updateById,
                users: newUsers
            });
        }
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
