import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { RouterRoutesEnum } from '../enumerations/global.enums';
import { WorksitesService } from '../stores/worksites/state';

@Injectable({
    providedIn: 'root',
})
export class NavigationHandlerService {
    constructor(
        private router: Router,
        private worksiteService: WorksitesService
    ) {}

    navigateToRoute(route: string, id?: string) {
        if (route === RouterRoutesEnum.ADD_HOURS && id) {
            this.worksiteService.setActive(id);
        }

        if (id) {
            this.router.navigate([route, id]);
        } else {
            this.router.navigate([route]);
        }
    }
}
