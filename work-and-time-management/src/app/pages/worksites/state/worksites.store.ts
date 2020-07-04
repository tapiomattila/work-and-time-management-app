import { EntityState, EntityStore, StoreConfig, ActiveState } from '@datorama/akita';
import { Worksite } from './worksites.model';
import { Injectable } from '@angular/core';

export interface WorksitesState extends EntityState<Worksite, ActiveState> { }

const initialState = {
    active: null
};

@Injectable({
    providedIn: 'root'
})
@StoreConfig({
    name: 'worksites',
    resettable: true
})
export class WorksiteStore extends EntityStore<WorksitesState> {
    constructor() {
        super(initialState);
    }
}