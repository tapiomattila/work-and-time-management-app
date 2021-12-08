import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { ActivatedRoute, Router, NavigationStart } from '@angular/router';
import { RouterRoutesEnum } from '../enumerations/global.enums';
import { first } from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class ManageService {
    subscriptions: Subscription[] = [];

    private modalSubj = new BehaviorSubject<boolean>(false);
    modalObs$ = this.modalSubj.asObservable();

    private genModalSubj = new BehaviorSubject<boolean>(false);
    genModalObs$ = this.genModalSubj.asObservable();

    constructor(private route: ActivatedRoute, private router: Router) {}

    routeEvents(
        routesEnumAdd: RouterRoutesEnum,
        routesEnumEdit: RouterRoutesEnum
    ) {
        const routerEventSubs = this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (event.url.includes(`/${routesEnumEdit}`)) {
                    this.modalSubj.next(true);
                }

                if (event.url === `/${routesEnumAdd}`) {
                    this.modalSubj.next(true);
                }
            }
        });
        this.subscriptions.push(routerEventSubs);
    }

    modalControl(route: ActivatedRoute) {
        const modalSubs = this.modalObs$.pipe(first()).subscribe(showModal => {
            if (!showModal) {
                const url = route.snapshot.url;
                if (url) {
                    url.forEach(el => {
                        if (el && el.path === 'add') {
                            this.modalSubj.next(true);
                        }
                    });
                }
            }
        });
        this.subscriptions.push(modalSubs);
    }

    setModal(value: boolean) {
        this.modalSubj.next(value);
    }

    closeModal(service, routesEnum) {
        service.setActive(null);
        this.modalSubj.next(false);
        this.router.navigate([`${routesEnum}`]);
    }

    setGeneralModal(value: boolean) {
        this.genModalSubj.next(value);
    }
}
