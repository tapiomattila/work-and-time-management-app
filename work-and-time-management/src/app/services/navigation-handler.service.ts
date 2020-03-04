import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { WorksitesQuery } from '../worksites/state/worksites.query';

@Injectable({
    providedIn: 'root'
})
export class NavigationHandlerService {

    private navigationSubj = new BehaviorSubject<string>('current-worksite');
    navigationObs$ = this.navigationSubj.asObservable();

    constructor(
        private router: Router,
        private worksiteQuery: WorksitesQuery
    ) {
        this.routeInfo();
    }

    routeInfo() {
        const index = window.location.href.indexOf('//');
        const part1 = window.location.href.substring(index + 2, window.location.href.length);
        const index2 = part1.indexOf('/');
        const part2 = part1.substring(index2 + 1, part1.length);
        const index3 = part2.indexOf('/');
        let route;

        if (index3 === -1) {
            route = part2;
        } else {
            route = part2.split('').splice(0, index3).join('');
        }

        switch (route) {
            case 'current-worksite':
                this.navigationSubj.next('current-worksite');
                break;
            case 'worksites':
                this.navigationSubj.next('worksites');
                break;
            case 'settings':
                this.navigationSubj.next('settings');
                break;
            case 'manage-users':
                this.navigationSubj.next('manage-users');
                break;
            case 'manage-worksites':
                this.navigationSubj.next('manage-worksites');
                break;
            default:
                break;
        }
    }

    setCurrentNavigationRoute(route: string) {
        if (route === 'add-hours') {
            const id = this.worksiteQuery.getActiveId();
            this.setRoute(route, id);
        } else {
            this.setRoute(route);
        }
    }

    setRoute(route: string, params?: string) {
        const routeMod = params ? `${route}/${params}` : route;
        this.navigationSubj.next(routeMod);
        this.router.navigate([`/${routeMod}`]);
    }
}
