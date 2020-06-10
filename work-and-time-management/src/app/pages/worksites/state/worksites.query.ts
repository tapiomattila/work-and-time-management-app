import { QueryEntity, Order } from '@datorama/akita';
import { WorksiteStore, WorksitesState } from './worksites.store';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Worksite } from './worksites.model';
import { map } from 'rxjs/operators';
import { WorksitesService } from './worksites.service';

@Injectable({
    providedIn: 'root'
})
export class WorksitesQuery extends QueryEntity<WorksitesState> {
    constructor(
        protected store: WorksiteStore,
        private worksiteService: WorksitesService
        ) {
        super(store);
    }

    selectRecentlyUpdateWorksite(): Observable<Worksite[]> {
        return this.selectAll({
            sortBy: 'updatedAt',
            sortByOrder: Order.DESC
        });
    }

     selectAndSetCurrentWorksite() {
        return this.selectRecentlyUpdateWorksite()
        .pipe(
          map((worksites: Worksite[]) => {
            if (worksites.length > 0) {
              this.worksiteService.setActive(worksites[0].id);
              return worksites[0];
            }
          })
        );
    }
}
