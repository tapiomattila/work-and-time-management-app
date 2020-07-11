import { QueryEntity } from '@datorama/akita';
import { WorksiteStore, WorksitesState } from './worksites.store';
import { Injectable } from '@angular/core';
import { map, switchMap, tap } from 'rxjs/operators';
import { HoursQuery } from 'src/app/auth/hours/hours.query';
import { of, Observable, BehaviorSubject } from 'rxjs';
import { Hours } from 'src/app/auth/hours';

@Injectable({
  providedIn: 'root'
})
export class WorksitesQuery extends QueryEntity<WorksitesState> {

  private addHoursSelectedDayMillisSubj = new BehaviorSubject<number>(null);
  addHoursSelectedDayMillisObs$ = this.addHoursSelectedDayMillisSubj.asObservable();

  active$ = this.selectActive();

  constructor(
    protected store: WorksiteStore,
    private hoursQuery: HoursQuery,
  ) {
    super(store);
  }

  selectActiveWorksite() {
    return this.selectActiveId()
      .pipe(
        switchMap(id => id ? this.selectEntity(id) : of(null))
      );
  }

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

  selectHoursForSelectedDay(): Observable<number> {
    let selectedDay;
    let hoursArr;
    return this.selectActiveId().pipe(
      switchMap(id => {
        return this.hoursQuery.selectAll({
          filterBy: [
            el => el.worksiteId === id
          ]
        });
      }),
      tap((hours: Hours[]) => {
        hoursArr = hours;
      }),
      switchMap(() => {
        return this.addHoursSelectedDayMillisObs$;
      }),
      map(selDayMillis => {
        const dayMillis1 = new Date(selDayMillis);
        const dayMillisDate = dayMillis1.getDate();
        const dayMillistMonth = dayMillis1.getMonth() + 1;
        const dayMillisYear = dayMillis1.getFullYear();

        selectedDay = {
          day: dayMillisDate,
          month: dayMillistMonth,
          year: dayMillisYear
        };

        const filteredHours = hoursArr.filter(el => {
          const lastUpdated = new Date(el.updatedAt);
          const date = lastUpdated.getDate();
          const month = lastUpdated.getMonth() + 1;
          const year = lastUpdated.getFullYear();
          const testDate = date === selectedDay.day && month === selectedDay.month && year === selectedDay.year;
          if (testDate) {
            return el;
          }
        });

        return filteredHours;
      }),
      map((hours: Hours[]) => hours ? hours.map(el => el.markedHours) : []),
      map(arr => {
        return arr.reduce((a, b) => a + b, 0);
      }),

    );
  }

  setAddHoursDateSelection(selection: number) {
    this.addHoursSelectedDayMillisSubj.next(selection);
  }


}


