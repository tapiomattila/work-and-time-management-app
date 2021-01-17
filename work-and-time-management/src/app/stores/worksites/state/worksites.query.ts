import { QueryEntity } from '@datorama/akita';
import { WorksiteStore, WorksitesState } from './worksites.store';
import { Injectable } from '@angular/core';
import { filter, map, switchMap, tap } from 'rxjs/operators';
import { HoursQuery } from 'src/app/auth/hours/hours.query';
import { of, Observable, BehaviorSubject, from } from 'rxjs';
import { Hours } from 'src/app/auth/hours';
import { WorkTypeQuery } from 'src/app/stores/worktypes/state';
import * as moment from 'moment';
import { formatHours } from 'src/app/helpers/helper-functions';
import { Worksite } from './worksites.model';
import { TableHours } from '../../../auth/hours/hours.model';

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
    private worktypeQuery: WorkTypeQuery
  ) {
    super(store);
  }

  selectActiveWorksite(): Observable<Worksite> {
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

  selectAllLiveWorksites() {
    return this.selectAll({
      filterBy: entity => !entity.deleted
    });
  }

  selectLiveWorksiteById(id: string) {
    return this.selectAllLiveWorksites()
      .pipe(
        map(el => el.find(elx => elx.id === id))
      );
  }

  selectWorksitesByUserId(id: string) {
    return this.selectAll({
      filterBy: entity => entity.users.includes(id),
    }).pipe(
      map(els => {
        return els.filter(el => !el.deleted);
      })
    );
  }

  getLiveWorksites() {
    const allEntities = this.getAll();
    return allEntities.filter(el => !el.deleted);
  }

  selectLastUpdatedWorksite() {
    const stampsArr = [];
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
      switchMap(stamps => {
        stamps.forEach(el => stampsArr.push(el));
        return this.selectAllLiveWorksites()
          .pipe(
            map(worksites => worksites.map(el => el.id))
          );
      }),
      map(idList => {
        const newArr = stampsArr.filter(el => idList.includes(el.worksiteId));
        return newArr.sort((a, b) => b.millis - a.millis);
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
      map((hours: Hours[]) => hours ? hours.map(el => el.hours) : []),
      map(arr => {
        return arr.reduce((a, b) => a + b, 0);
      }),

    );
  }

  setAddHoursDateSelection(selection: number) {
    this.addHoursSelectedDayMillisSubj.next(selection);
  }

  getWorksiteById(worksiteId: string) {
    return this.getAll().filter(el => el.id === worksiteId);
  }

  selectTableHours(hours: Hours[]) {
    return hours.map(el => {
      const worksiteName = this.getWorksiteById(el.worksiteId);
      const worksiteNameFound = worksiteName && worksiteName.length > 0 ? worksiteName[0].name : undefined;

      const worktypeId = this.hoursQuery.getHourWorktype(el.id);
      const worktype = this.worktypeQuery.getWorktypeById(worktypeId);
      const worktypeNameFound = worktype ? worktype.name : undefined;

      const formattedDate = moment(el.updatedAt).format('DD.MM.YYYY');
      const hoursFormatted = formatHours(el.hours);

      return {
        ...el,
        updateAtFormatted: formattedDate,
        worksiteName: worksiteNameFound,
        worktypeName: worktypeNameFound,
        worktypeId,
        hoursFormatted
      };
    });
  }

}


