import { Injectable } from "@angular/core";
import { WorksiteStore } from './worksites.store';
import { Worksite, createWorksite } from './worksites.model';

@Injectable({
    providedIn: "root"
})
export class WorksitesService {
    constructor(
        private worksitesStore: WorksiteStore
    ) { }

    setWorksites(worksites: Partial<Worksite>[]) {
        const worksiteArray = new Array();
        worksites.forEach(el => {
            worksiteArray.push(createWorksite(el));
        })

        this.worksitesStore.set(worksiteArray);
    }

}