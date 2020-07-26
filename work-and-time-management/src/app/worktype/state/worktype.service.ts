import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first, tap } from 'rxjs/operators';
import { FireBaseCollectionsEnum } from 'src/app/enumerations/global.enums';
import { WorktypeStore } from './worktype.store';
import { WorkType, createWorkType } from './worktype.model';

@Injectable({
    providedIn: 'root'
})
export class WorkTypeService {
    constructor(
        private worktypeStore: WorktypeStore,
        private af: AngularFirestore
    ) { }

    setActive(id: string) {
        console.log('show in acive id', id);
        this.worktypeStore.setActive(id);
    }

    setWorkTypes(worktypes: Partial<WorkType>[]) {
        const worktypeArray = new Array();
        worktypes.forEach(el => {
            worktypeArray.push(createWorkType(el));
        });

        this.worktypeStore.set(worktypeArray);
    }

    setWorkTypeStore() {
        return this.fetchWorkTypes()
            .pipe(
                tap(res => {
                    if (res && res.length) {
                        this.setWorkTypes(res);
                    }
                }),
            );
    }

    fetchWorkTypes() {
        return this.af.collection(`${FireBaseCollectionsEnum.WORKTYPES}`)
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

    resetStore() {
        this.worktypeStore.reset();
    }

}
