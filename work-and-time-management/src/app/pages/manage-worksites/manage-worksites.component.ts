import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationStart, Params } from '@angular/router';
import { RouterRoutesEnum } from 'src/app/enumerations/global.enums';
import { WorksitesQuery, Worksite, WorksitesService } from '../worksites/state';
import { Observable, BehaviorSubject, Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UserQuery } from 'src/app/auth/user';

@Component({
    selector: 'app-manage-worksites',
    templateUrl: './manage-worksites.component.html',
    styleUrls: ['./manage-worksites.component.scss']
})
export class ManageWorksitesComponent implements OnInit, OnDestroy {

    subscriptions: Subscription[] = [];

    private modalSubj = new BehaviorSubject<boolean>(false);
    modalObs$ = this.modalSubj.asObservable();

    activeWorksite$: Observable<Worksite>;
    worksites$: Observable<Worksite[]>;
    showModal$: Observable<boolean>;
    worksiteForm: FormGroup;

    constructor(
        private router: Router,
        private worksitesQuery: WorksitesQuery,
        private route: ActivatedRoute,
        private worksiteService: WorksitesService,
        private userQuery: UserQuery
    ) { }

    ngOnInit() {
        this.worksites$ = this.worksitesQuery.selectAllLiveWorksites();
        this.activeWorksite$ = this.worksitesQuery.selectActiveWorksite();
        this.initForm();
        this.routeParams();
        this.routeEvents();
        this.modalControl();
    }

    initForm() {
        this.worksiteForm = new FormGroup({
            nickname: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
            streetAddress: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
            postalCode: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
            city: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)]),
        });
    }

    routeParams() {
        const routeSubs = this.route.params.subscribe((res: Params) => {
            if (!res.id) {
                console.warn('No route params id');
                return;
            }

            this.modalSubj.next(true);
            const worksite = this.worksitesQuery.getEntity(res.id);

            if (!worksite) {
                const fetchByIdSubs = this.worksiteService.fetchWorksiteById(res.id).subscribe(res2 => {

                    if (!res2 || !res2.data) {
                        this.router.navigate([RouterRoutesEnum.DASHBOARD]);
                        return;
                    }

                    const mapped = res2.data as Worksite;
                    this.populateForm(mapped);
                    this.worksiteService.setActive(res2.id);

                });
                this.subscriptions.push(fetchByIdSubs);
                return;
            }

            this.populateForm(worksite);
            this.worksiteService.setActive(worksite.id);
        });
        this.subscriptions.push(routeSubs);
    }

    routeEvents() {
        const routerEventSubs = this.router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (event.url.includes(`/${RouterRoutesEnum.EDIT_WORKSITE}`)) {
                    this.modalSubj.next(true);
                }

                if (event.url === `/${RouterRoutesEnum.ADD_WORKSITE}`) {
                    this.modalSubj.next(true);
                }
            }
        });
        this.subscriptions.push(routerEventSubs);
    }

    modalControl() {
        const modalSubs = this.modalObs$.subscribe(res => {
            if (!res) {
                const url = this.route.snapshot.url;
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

    populateForm(worksite: Worksite) {
        this.worksiteForm.controls.nickname.setValue(worksite.nickname);
        this.worksiteForm.controls.streetAddress.setValue(worksite.streetAddress);
        this.worksiteForm.controls.postalCode.setValue(worksite.postalCode);
        this.worksiteForm.controls.city.setValue(worksite.city);
    }

    backArrowPressed() {
        this.router.navigate([RouterRoutesEnum.DASHBOARD]);
    }

    edit(worksite: Worksite, index: number) {
        this.worksiteService.setActive(worksite.id);
        this.router.navigate([`${RouterRoutesEnum.EDIT_WORKSITE}/${worksite.id}`]);
    }

    addNew() {
        this.router.navigate([RouterRoutesEnum.ADD_WORKSITE]);
    }

    submit() {
        if (!this.worksiteForm.valid) {
            return;
        }

        const formValues = this.worksiteForm.value;
        const activeWorksite = this.worksitesQuery.getActive() as Worksite;

        if (activeWorksite) {
            this.updateWorksite(formValues, activeWorksite);
        } else {
            this.postNewWorksite(formValues);
        }
    }

    updateWorksite(formValues: Partial<Worksite>, activeWorksite: Worksite) {
        const updatedWorksite: Partial<Worksite> = {
            nickname: formValues.nickname,
            updatedAt: new Date().toISOString(),
            streetAddress: formValues.streetAddress,
            postalCode: formValues.postalCode,
            city: formValues.city,
        };

        this.worksiteService.putWorksite(activeWorksite.id, updatedWorksite).subscribe(() => {
            this.worksiteService.updateWorksite(activeWorksite, updatedWorksite);

            setTimeout(() => {
                this.closeModal();
            }, 250);
        });
    }

    postNewWorksite(formValues: Partial<Worksite>) {

        const user = this.userQuery.getValue();

        const newWorksite: Partial<Worksite> = {
            createdAt: new Date().toISOString(),
            createdBy: user.id,
            updatedAt: new Date().toISOString(),
            updatedBy: user.id,
            nickname: formValues.nickname,
            streetAddress: formValues.streetAddress,
            postalCode: formValues.postalCode,
            city: formValues.city,
            users: [user.id]
        };

        this.worksiteService.postNewWorksite(newWorksite).subscribe(worksite => {
            this.worksiteService.addNewWorksiteToStore(newWorksite, worksite.id);

            setTimeout(() => {
                this.closeModal();
            }, 250);
        });

    }

    deleteWorksite() {
        if (prompt('Type "remove" to delete worksite') === 'remove') {
            const active = this.worksitesQuery.getActive() as Worksite;
            const user = this.userQuery.getValue();

            this.worksiteService.putWorksite(active.id,
                {
                    updatedAt: new Date().toISOString(),
                    updatedBy: user.id,
                    deleted: true
                })
                .subscribe(() => {
                    this.worksiteService.updateDeleted(active, {
                        updatedAt: new Date().toISOString(),
                        updatedBy: user.id,
                        deleted: true
                    });

                    setTimeout(() => {
                        this.closeModal();
                    }, 250);
                });
        }
    }

    closeModal() {
        this.worksiteService.setActive(null);
        this.modalSubj.next(false);
        this.router.navigate([`${RouterRoutesEnum.MANAGE_WORKSITES}`]);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(el => el.unsubscribe());
    }
}
