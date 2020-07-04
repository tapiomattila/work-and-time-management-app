import { QueryEntity, Order } from '@datorama/akita';
import { WorksiteStore, WorksitesState } from './worksites.store';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Worksite } from './worksites.model';
import { map, switchMap } from 'rxjs/operators';
import { WorksitesService } from './worksites.service';
import { HoursQuery } from 'src/app/auth/hours/hours.query';

@Injectable({
  providedIn: 'root'
})
export class WorksitesQuery extends QueryEntity<WorksitesState> {
  constructor(
    protected store: WorksiteStore,
    private worksiteService: WorksitesService,
    private hoursQuery: HoursQuery,
  ) {
    super(store);
  }

  // selectRecentlyUpdateWorksite(): Observable<Worksite[]> {
  //     return this.selectAll({
  //         sortBy: 'updatedAt',
  //         sortByOrder: Order.DESC
  //     });
  // }

  //  selectAndSetCurrentWorksite() {
  //     return this.selectRecentlyUpdateWorksite()
  //     .pipe(
  //       map((worksites: Worksite[]) => {
  //         if (worksites.length > 0) {
  //           this.worksiteService.setActive(worksites[0].id);
  //           return worksites[0];
  //         }
  //       })
  //     );
  // }

  selectWorksiteById(worksiteId: string) {
    return this.selectAll({
      filterBy: entity => entity.id === worksiteId
    });
  }

  selectLastUpdatedWorksite() {
    return this.hoursQuery.hours$.pipe(
      map(hours => {
        return hours.map(el => {
          const date = new Date(el.createdAt);
          const millis = date.getTime();
          return {
            id: el.id,
            worksiteId: el.worksiteId,
            millis,
          };
        });
      }),
      map(stamps => {
        return stamps.sort((a, b) => b.millis - a.millis);
      }),
      map(list => list.length ? list[0].worksiteId : ''),
      switchMap(worksiteId => {
        return worksiteId.length > 0 ? this.selectWorksiteById(worksiteId) : of(null);
      }),
      map(worksites => worksites ? worksites[0] : null)
    );
  }
}
