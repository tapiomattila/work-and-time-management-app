import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class NavigationHandlerService {

    private navigationSubj = new BehaviorSubject<string>('current-worksite');
    navigationObs$ = this.navigationSubj.asObservable();

    constructor(
        private router: Router
    ) { }

    setCurrentNavigationRoute(route: string) {
        this.navigationSubj.next(route);
        this.router.navigate([`/${route}`]);
    }
}
