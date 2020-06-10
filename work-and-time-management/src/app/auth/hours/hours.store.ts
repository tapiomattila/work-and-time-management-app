import { EntityState, EntityStore, StoreConfig, ActiveState } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { Hours } from './hours.model';

export interface HoursState extends EntityState<Hours, ActiveState> { }

const initialState = {
    active: null
};

@Injectable({
    providedIn: 'root'
})
@StoreConfig({
    name: 'hours'
})
export class HoursStore extends EntityStore<HoursState> {
    constructor() {
        super(initialState);
    }
}
