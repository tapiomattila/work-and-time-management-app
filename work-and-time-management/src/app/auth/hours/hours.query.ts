import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { HoursState, HoursStore } from './hours.store';
import { map } from 'rxjs/operators';
import { Hours } from './hours.model';

@Injectable({
    providedIn: 'root'
})
export class HoursQuery extends QueryEntity<HoursState> {

    hours$ = this.selectAll();

    constructor(protected store: HoursStore) {
        super(store);
    }

    selectHoursForWorksite(worksiteId: string) {
        return this.selectAll({
            filterBy: [
                el => el.worksiteId === worksiteId
            ]
        }).pipe(
            map((hoursArray: Hours[]) => hoursArray[0] ? hoursArray[0].markedHours.toString() : '')
        );
    }

}
