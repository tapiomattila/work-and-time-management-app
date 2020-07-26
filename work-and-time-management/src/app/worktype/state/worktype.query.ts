import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { WorkTypeState, WorktypeStore } from './worktype.store';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class WorkTypeQuery extends QueryEntity<WorkTypeState> {

    constructor(protected store: WorktypeStore) {
        super(store);
    }

    getWorktypeById(id: string) {
        const found = this.getAll().filter(el => el.id === id);
        if (found) {
            return found[0];
        }
        return undefined;
    }

    selectActiveWorktype() {
        return this.selectActiveId()
          .pipe(
            switchMap(id => id ? this.selectEntity(id) : of(null))
          );
      }

}
