import { UserStore } from './user.store';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first, tap } from 'rxjs/operators';
import { User, createUser } from './user.model';
import { FireBaseCollectionsEnum } from 'src/app/enumerations/global.enums';
import { HoursService } from '../hours';
import { WorksitesService } from 'src/app/pages/worksites/state';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    constructor(
        private userStore: UserStore,
        private af: AngularFirestore,
        private hourService: HoursService,
        private worksiteService: WorksitesService
    ) { }

    updateUser(user: Partial<User>) {
        this.userStore.update(createUser(user));
    }

    fetchAllUsers() {
        return this.af.collection(FireBaseCollectionsEnum.USERS)
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
        this.userStore.reset();
    }

    resetAllStores() {
        this.userStore.reset();
        this.worksiteService.resetStore();
        this.hourService.resetStore();
    }
}
