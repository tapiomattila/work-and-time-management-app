import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { HoursState, HoursStore } from './hours.store';
import { map, switchMap } from 'rxjs/operators';
import { Hours } from './hours.model';
import { Observable, of } from 'rxjs';
import * as moment from 'moment';

@Injectable({
    providedIn: 'root'
})
export class HoursQuery extends QueryEntity<HoursState> {

    hours$ = this.selectAll();

    constructor(
        protected store: HoursStore,
    ) {
        super(store);
    }

    selectHoursForWorksite(worksiteId: string): Observable<number> {
        return this.selectAll({
            filterBy: [
                el => el.worksiteId === worksiteId
            ]
        }).pipe(
            map((hours: Hours[]) => hours.map(el => el.markedHours)),
            map(hoursArr => {
                return hoursArr.reduce((a, b) => a + b, 0);
            }),
        );
    }

    selectHoursForDay(millis: number, activeWorksiteId: string) {

        const dayMillis1 = new Date(millis);
        // console.log('show day millis', dayMillis1);

        const moment1 = moment(dayMillis1);
        // console.log('show moment', moment1);

        return this.selectAll({
            filterBy: [
                el => {
                    return moment(el.createdAt).isSame(dayMillis1, 'day') && el.worksiteId === activeWorksiteId;
                }
            ]
        });
    }

    getHourWorktype(hourId: string) {
        const hoursById = this.getAll().filter(el => el.id === hourId);
        if (hoursById) {
            const element = hoursById[0];
            return element.worktypeId;
        }
    }

    selectActiveHours() {
        return this.selectActiveId()
          .pipe(
            switchMap(id => id ? this.selectEntity(id) : of(null))
          );
      }

}
