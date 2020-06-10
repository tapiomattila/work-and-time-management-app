import { QueryEntity } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { HoursState, HoursStore } from './hours.store';

@Injectable({
    providedIn: 'root'
})
export class HoursQuery extends QueryEntity<HoursState> {
    constructor(protected store: HoursStore) {
        super(store);
    }
}
