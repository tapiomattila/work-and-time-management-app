import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { Hours } from './hours.model';

export interface HoursState extends EntityState<Hours, string> { }

const initialState = {
    active: null
};

@Injectable({
    providedIn: 'root'
})
@StoreConfig({
    name: 'hours',
    resettable: true
})
export class HoursStore extends EntityStore<HoursState> {
    constructor() {
        super(initialState);
    }
}
