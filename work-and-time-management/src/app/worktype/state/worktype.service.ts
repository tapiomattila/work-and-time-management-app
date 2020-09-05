import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first, tap, delay } from 'rxjs/operators';
import { FireBaseCollectionsEnum } from 'src/app/enumerations/global.enums';
import { WorktypeStore } from './worktype.store';
import { WorkType, createWorkType } from './worktype.model';
import { from, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WorkTypeService {
    constructor(
        private worktypeStore: WorktypeStore,
        private af: AngularFirestore
    ) { }

    setActive(id: string) {
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
                    // console.log('fetch worktypes res', res);
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

    fetchWorktypeById(id: string) {
        return this.af.collection(FireBaseCollectionsEnum.WORKTYPES).doc(id)
            .snapshotChanges()
            .pipe(
                map(snap => {
                    return { id: snap.payload.id, data: snap.payload.data() };
                }),
                first()
            );
    }

    putWorktype(id: string, changes: Partial<WorkType>): Observable<any> {
        return from(this.af.doc(`${FireBaseCollectionsEnum.WORKTYPES}/${id}`).update(changes));
    }

    updateWorktype(worktype: WorkType, updated: Partial<WorkType>): void {
        this.worktypeStore.update(worktype.id,
            {
                ...worktype,
                updatedAt: updated.updatedAt,
                updatedBy: updated.updatedBy,
                viewName: updated.viewName,
                workType: updated.workType,
            });
    }

    postNewWorktype(worktype: Partial<WorkType>) {
        return from(this.af.collection(`${FireBaseCollectionsEnum.WORKTYPES}`).add(worktype));
    }

    addNewWorktypeToStore(worktype: Partial<WorkType>, id: string) {
        worktype.id = id;
        const newworktype = createWorkType(worktype);
        this.worktypeStore.add(newworktype);
    }

    updateDeleted(worktype: WorkType, changes: {
        updatedAt: string,
        updatedBy: string,
        deleted: true
    }) {
        this.worktypeStore.update(worktype.id,
            {
                ...worktype,
                deleted: changes.deleted,
                updatedAt: changes.updatedAt,
                updatedBy: changes.updatedBy
            });
    }

    resetStore() {
        this.worktypeStore.reset();
    }

}
