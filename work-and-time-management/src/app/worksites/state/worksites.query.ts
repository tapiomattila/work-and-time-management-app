import { QueryEntity, Order } from '@datorama/akita';
import { WorksiteStore, WorksitesState } from './worksites.store';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Worksite } from './worksites.model';

@Injectable({
    providedIn: 'root'
})
export class WorksitesQuery extends QueryEntity<WorksitesState> {
    constructor(protected store: WorksiteStore) {
        super(store);
    }

    selectRecentlyUpdateWorksite(): Observable<Worksite[]> {
        return this.selectAll({
            sortBy: 'updatedAt',
            sortByOrder: Order.DESC
        });
    }
}