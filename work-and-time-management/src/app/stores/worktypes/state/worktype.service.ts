import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first, tap, delay, switchMap } from 'rxjs/operators';
import { FireBaseCollectionsEnum } from 'src/app/enumerations/global.enums';
import { WorktypeStore } from './worktype.store';
import { WorkType, createWorkType } from './worktype.model';
import { from, Observable, of } from 'rxjs';
import { Auth } from 'src/app/auth/state';
import { User } from '../../users';
import { doesArrayExist } from 'src/app/helpers/helper-functions';

@Injectable({
    providedIn: 'root',
})
export class WorkTypeService {
    constructor(
        private worktypeStore: WorktypeStore,
        private af: AngularFirestore
    ) {}

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

    fetchWorkTypes(user: User) {
        const params = ref => ref.where('clientId', '==', user.clientId);
        return this.af
            .collection(`${FireBaseCollectionsEnum.WORKTYPES}`, params)
            .snapshotChanges()
            .pipe(
                map(snaps => {
                    return this.snapsToObjects(snaps);
                }),
                first()
            );
    }

    fetchWorktypeById(id: string) {
        return this.af
            .collection(FireBaseCollectionsEnum.WORKTYPES)
            .doc(id)
            .snapshotChanges()
            .pipe(
                map(snap => {
                    return { id: snap.payload.id, data: snap.payload.data() };
                }),
                first()
            );
    }

    fetchWorktypesByUser(user$: Observable<User>) {
        return user$.pipe(
            switchMap((user: User) =>
                user && user.id ? this.fetchWorkTypes(user) : of(null)
            ),
            tap(res => {
                if (doesArrayExist(res)) {
                    this.setWorkTypes(res);
                }
            })
        );
    }

    putWorktype(id: string, changes: Partial<WorkType>): Observable<any> {
        return from(
            this.af
                .doc(`${FireBaseCollectionsEnum.WORKTYPES}/${id}`)
                .update(changes)
        );
    }

    updateWorktype(worktype: WorkType, updated: Partial<WorkType>): void {
        this.worktypeStore.update(worktype.id, {
            ...worktype,
            updatedAt: updated.updatedAt,
            updatedBy: updated.updatedBy,
            name: updated.name,
            rate: updated.rate,
        });
    }

    postNewWorktype(worktype: Partial<WorkType>) {
        return from(
            this.af
                .collection(`${FireBaseCollectionsEnum.WORKTYPES}`)
                .add(worktype)
        );
    }

    addNewWorktypeToStore(worktype: Partial<WorkType>, id: string) {
        worktype.id = id;
        const newworktype = createWorkType(worktype);
        this.worktypeStore.add(newworktype);
    }

    updateDeleted(
        worktype: WorkType,
        changes: {
            updatedAt: string;
            updatedBy: string;
            deleted: true;
        }
    ) {
        this.worktypeStore.update(worktype.id, {
            ...worktype,
            deleted: changes.deleted,
            updatedAt: changes.updatedAt,
            updatedBy: changes.updatedBy,
        });
    }

    resetStore() {
        this.worktypeStore.reset();
    }

    snapsToObjects(snaps: any[]) {
        return snaps.map(snap => {
            const id = snap.payload.doc.id;
            const data = snap.payload.doc.data();
            return {
                id,
                ...(data as object),
            };
        });
    }
}
