import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { HoursState, HoursStore } from './hours.store';
import { map } from 'rxjs/operators';
import { Hours } from './hours.model';
import { Observable } from 'rxjs';

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

}
