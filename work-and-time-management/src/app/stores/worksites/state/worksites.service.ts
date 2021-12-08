import { Injectable } from '@angular/core';
import { WorksiteStore } from './worksites.store';
import { Worksite, createWorksite } from './worksites.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { map, first, tap, delay, switchMap } from 'rxjs/operators';
import {
  FireBaseCollectionsEnum,
  Role,
} from 'src/app/enumerations/global.enums';
import { Observable, from, of } from 'rxjs';
import { Auth } from 'src/app/auth/state';
import { User } from '../../users';
import { mapSnaps } from 'src/app/helpers/helper-functions';

@Injectable({
  providedIn: 'root',
})
export class WorksitesService {
  constructor(
    private worksitesStore: WorksiteStore,
    private af: AngularFirestore
  ) {}

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

  setWorksiteStoreAdmin(clientId: string) {
    return this.fetchAllClientWorksites(clientId).pipe(
      tap(res => {
        if (res && res.length) {
          this.setWorksites(res);
        }
      }),
      first()
    );
  }

  fetchAllClientWorksites(clientId: string) {
    const worksitesRef = this.af.collection<Worksite[]>(
      FireBaseCollectionsEnum.WORKSITES,
      ref => ref.where('clientId', '==', clientId)
    );

    return worksitesRef.snapshotChanges().pipe(
      map(snaps => {
        return this.mapSnapToWorksite(snaps);
      }),
      first()
    );
  }

  fetchUserWorksites(user: User) {
    const query = this.af.collection<Worksite[]>(
      FireBaseCollectionsEnum.WORKSITES,
      ref =>
        ref
          .where('users', 'array-contains', user.userId)
          .where('clientId', '==', user.clientId)
    );

    return query.snapshotChanges().pipe(
      map(snaps => {
        return this.mapSnapToWorksite(snaps);
      }),
      first()
    );
  }

  fetchAllWorksites() {
    return this.af
      .collection(FireBaseCollectionsEnum.WORKSITES)
      .snapshotChanges()
      .pipe(
        delay(1000),
        map(snaps => {
          return mapSnaps(snaps);
        }),
        first()
      );
  }

  fetchWorksiteById(id: string) {
    return this.af
      .collection(FireBaseCollectionsEnum.WORKSITES)
      .doc(id)
      .snapshotChanges()
      .pipe(
        map(snap => {
          return { id: snap.payload.id, data: snap.payload.data() };
        }),
        first()
      );
  }

  putWorksite(worksiteId: string, changes: Partial<Worksite>): Observable<any> {
    return from(
      this.af
        .doc(`${FireBaseCollectionsEnum.WORKSITES}/${worksiteId}`)
        .update(changes)
    );
  }

  updateWorksite(worksite: Worksite, updated: Partial<Worksite>): void {
    this.worksitesStore.update(worksite.id, {
      ...worksite,
      updatedAt: updated.updatedAt,
      name: updated.name,
      streetAddress: updated.streetAddress,
      postalCode: updated.postalCode,
      city: updated.city,
      deleted: updated.deleted,
    });
  }

  updateDeleted(
    worksite: Worksite,
    changes: {
      updatedAt: string;
      updatedBy: string;
      deleted: true;
    }
  ) {
    this.worksitesStore.update(worksite.id, {
      ...worksite,
      deleted: changes.deleted,
      updatedAt: changes.updatedAt,
      updatedBy: changes.updatedBy,
    });
  }

  updateStoreWorksiteUsers(
    worksite: Worksite,
    newUsers: string[],
    type: 'add' | 'remove',
    updateById: string
  ) {
    if (type === 'add') {
      this.worksitesStore.update(worksite.id, {
        ...worksite,
        updatedAt: new Date().toISOString(),
        updatedBy: updateById,
        users: newUsers,
      });
    }

    if (type === 'remove') {
      this.worksitesStore.update(worksite.id, {
        ...worksite,
        updatedAt: new Date().toISOString(),
        updatedBy: updateById,
        users: newUsers,
      });
    }
  }

  postNewWorksite(worksite: Partial<Worksite>) {
    return from(
      this.af.collection(`${FireBaseCollectionsEnum.WORKSITES}`).add(worksite)
    );
  }

  addNewWorksiteToStore(worksite: Partial<Worksite>, id: string) {
    worksite.id = id;
    const newWorksite = createWorksite(worksite);
    this.worksitesStore.add(newWorksite);
  }

  resetStore() {
    this.worksitesStore.reset();
  }

  fetchUserWorksitesByClientXX2(user$: Observable<User>) {
    return user$.pipe(
      switchMap((user: User) => {
        const access =
          user &&
          user.id &&
          (user.roles.includes(Role.ADMIN) ||
            user.roles.includes(Role.MANAGER));
        return access ? this.fetchAllClientWorksites(user.clientId) : of(null);
      }),
      tap((worksites: Worksite[]) => {
        if (worksites) {
          this.setWorksites(worksites);
        }
      }),
      switchMap(() => user$),
      switchMap((user: User) => {
        const access = user && user.id;
        return access ? this.fetchUserWorksites(user) : of(null);
      }),
      tap((worksites: Worksite[]) => {
        if (worksites) {
          this.setWorksites(worksites);
        }
      })
    );

    //   .subscribe();

    //   const worktypeSub = this.user$.pipe(
    //     switchMap((user: User) => user && user.id ? this.worktypeService.fetchWorkTypes(user) : of(null)),
    //     tap(res => {
    //       if (this.doesArrayExist(res)) {
    //         this.worktypeService.setWorkTypes(res);
    //       }
    //     })
    //   )
  }

  private mapSnapToWorksite(snaps) {
    return snaps.map(snap => {
      const id = snap.payload.doc.id;
      const data = snap.payload.doc.data();
      const worksite = {
        id,
        ...(data as object),
      } as Worksite;
      return worksite;
    });
  }
}
