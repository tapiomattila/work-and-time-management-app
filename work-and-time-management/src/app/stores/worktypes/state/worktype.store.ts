import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import { Injectable } from '@angular/core';
import { WorkType } from './worktype.model';

export interface WorkTypeState extends EntityState<WorkType, string> {}

const initialState = {
    active: null,
};

@Injectable({
    providedIn: 'root',
})
@StoreConfig({
    name: 'worktypes',
    resettable: true,
})
export class WorktypeStore extends EntityStore<WorkTypeState> {
    constructor() {
        super(initialState);
    }
}
