import { UserStore } from './user.store';
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first, delay, catchError, tap } from 'rxjs/operators';
import { User, createUser } from './user.model';
import { FireBaseCollectionsEnum } from 'src/app/enumerations/global.enums';
import { HoursService } from '../hours';
import { WorksitesService } from 'src/app/pages/worksites/state';
import { of, throwError, forkJoin, from } from 'rxjs';
import { Auth } from '../state';

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

    fetchAllUsersInfos(auth: Auth) {
        return this.af.collection(FireBaseCollectionsEnum.USERS_INFOS,
            ref => ref.where('_c', '==', auth.clientId))
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

    fetchUserInfosById(id: string, clientId: string) {
        // return this.af.collection(FireBaseCollectionsEnum.USERS_INFOS,
        //     ref => ref.where('_c', '==', auth.clientId))
        //     .snapshotChanges()
        //     .pipe(
        //         delay(1000),
        //         map(snaps => {
        //             return snaps.map(snap => {
        //                 const id = snap.payload.doc.id;
        //                 const data = snap.payload.doc.data();
        //                 return {
        //                     id,
        //                     ...(data as object)
        //                 };
        //             });

        //         }),
        //         first()
        //     );

        return this.af.collection(FireBaseCollectionsEnum.USERS_INFOS,
            ref => ref.where('_c', '==', clientId)).doc(id)
            .snapshotChanges()
            .pipe(
                map((snap: any) => {
                    return {
                        id: snap.payload.id,
                        ...(snap.payload.data() as object)
                    };
                })
            );
    }

    fetchUserById(id: string) {
        return this.af.collection(FireBaseCollectionsEnum.USERS).doc(id)
            .snapshotChanges()
            .pipe(
                map((snap: any) => {
                    return {
                        id: snap.payload.id,
                        ...(snap.payload.data() as object)
                    };
                })
            );
    }

    fetchAUsers() {
        return this.af.collection('usersadmin')
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
                first(),
                catchError(err => {
                    return throwError(new Error('No permission for admin list'));
                })
            );
    }

    fetchMUsers() {
        return this.af.collection('usersmanager')
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
                first(),
                catchError(err => {
                    return throwError(new Error('No permission for manager list'));
                })
            );
    }

    isAdminManager(users: any[], id: string) {
        let isAdmin;
        if (users) {
            isAdmin = users.find(el => el.id === id);
        }
        if (isAdmin) {
            const user: Partial<User> = {
                id,
                isAdmin: true,
            };
            this.updateUser(user);
        }
    }

    isManagerManager(users: { id: string; isManager: boolean }[], id: string) {
        let isManager;
        if (users) {
            isManager = users.find(el => el.id === id);
        }
        if (isManager) {
            const user: Partial<User> = {
                id,
                isManager: true,
            };
            this.updateUser(user);
        }
    }

    fetchAllRolesJoin() {
        return forkJoin(
            this.fetchAUsers().pipe(catchError(error => of(error))),
            this.fetchMUsers().pipe(catchError(error => of(error))),
        );
    }


    setRoles(el: any[], authId: string) {
        const has = Object.prototype.hasOwnProperty;
        if (has.call(el[0], 'isAdmin')) {
            this.isAdminManager(el, authId);
        }

        if (has.call(el[0], 'isManager')) {
            this.isManagerManager(el, authId);
        }
    }

    postUser(id: string, user: { firstName: string, lastName: string, email: string }) {
        return from(this.af.collection(FireBaseCollectionsEnum.USERS_INFOS).doc(id).set(user));
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
