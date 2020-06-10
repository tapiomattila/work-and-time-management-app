import { Injectable } from '@angular/core';
import { HoursStore } from './hours.store';

@Injectable({
    providedIn: 'root'
})
export class HoursService {
    constructor(
        private hoursStore: HoursStore,
    ) { }

    setActive(id: string) {
        this.hoursStore.setActive(id);
    }
}
