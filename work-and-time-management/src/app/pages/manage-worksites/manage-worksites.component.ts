import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Role, RouterRoutesEnum } from 'src/app/enumerations/global.enums';
import {
    WorksitesQuery,
    Worksite,
    WorksitesService,
} from '../../stores/worksites/state';
import { Observable, of, Subscription } from 'rxjs';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ManageService } from '../manage.service';
import { fadeInEnterTrigger } from 'src/app/animations/animations';
import { AuthQuery } from 'src/app/auth/state';
import { switchMap } from 'rxjs/operators';
import * as moment from 'moment';
import { User, UserQuery, UserService } from 'src/app/stores/users';

@Component({
    selector: 'app-manage-worksites',
    templateUrl: './manage-worksites.component.html',
    styleUrls: ['./manage-worksites.component.scss'],
    animations: [fadeInEnterTrigger],
})
export class ManageWorksitesComponent implements OnInit, OnDestroy {
    private subscriptions: Subscription[] = [];
    user$: Observable<User>;
    activeWorksite$: Observable<Worksite>;
    worksites$: Observable<Worksite[]>;
    showModal$: Observable<boolean>;
    worksiteForm: FormGroup;

    momentDay: moment.Moment;
    isAdmin: boolean | undefined;

    constructor(
        private router: Router,
        private worksitesQuery: WorksitesQuery,
        private route: ActivatedRoute,
        private worksiteService: WorksitesService,
        private userQuery: UserQuery,
        public manageService: ManageService,
        private userService: UserService,
        private authQuery: AuthQuery
    ) {}

    ngOnInit() {
        this.momentDay = moment();
        this.worksites$ = this.worksitesQuery.selectAllLiveWorksites();

        this.activeWorksite$ = this.worksitesQuery.selectActiveWorksite();
        this.initForm();
        this.routeParams();
        this.manageService.routeEvents(
            RouterRoutesEnum.ADD_WORKTYPE,
            RouterRoutesEnum.EDIT_WORKSITE
        );
        this.manageService.modalControl(this.route);
        this.user$ = this.authQuery.auth$.pipe(
            switchMap(auth => this.userQuery.selectUserByUserId(auth.id))
        );

        const userSub = this.user$.subscribe((user: User) => {
            this.isAdmin = user ? user.roles.includes(Role.ADMIN) : false;
        });

        const allInfosSubs = this.authQuery.auth$
            .pipe(
                switchMap(auth => {
                    if (!auth) {
                        return of(null);
                    }
                    return this.userService.fetchAllUsersByClientId(
                        auth.clientId
                    );
                })
            )
            .subscribe();

        this.subscriptions.push(userSub);
        this.subscriptions.push(allInfosSubs);
    }

    initForm() {
        this.worksiteForm = new FormGroup({
            name: new FormControl('', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(50),
            ]),
            streetAddress: new FormControl('', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(50),
            ]),
            postalCode: new FormControl('', [
                Validators.required,
                Validators.minLength(2),
                Validators.maxLength(20),
                Validators.pattern('^[0-9]*$'),
            ]),
            city: new FormControl('', [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(50),
            ]),
        });
    }

    routeParams() {
        const routeSubs = this.route.params.subscribe((res: Params) => {
            if (!res.id) {
                console.warn('No route params id');
                return;
            }

            this.manageService.setModal(true);
            const worksite = this.worksitesQuery.getEntity(res.id);
            this.setupModal(worksite, res);
            if (worksite) {
                this.populateForm(worksite);
                this.worksiteService.setActive(worksite.id);
            }
        });
        this.subscriptions.push(routeSubs);
    }

    setupModal(worksite: Worksite, routeResponse: Params) {
        if (!worksite) {
            const fetchByIdSubs = this.worksiteService
                .fetchWorksiteById(routeResponse.id)
                .subscribe(res2 => {
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
    }

    populateForm(worksite: Worksite) {
        this.worksiteForm.controls.name.setValue(worksite.name);
        this.worksiteForm.controls.streetAddress.setValue(
            worksite.info.streetAddress
        );
        this.worksiteForm.controls.postalCode.setValue(
            worksite.info.postalCode
        );
        this.worksiteForm.controls.city.setValue(worksite.info.city);
    }

    edit(worksite: Worksite, index: number) {
        this.worksiteService.setActive(worksite.id);
        this.router.navigate([
            `${RouterRoutesEnum.EDIT_WORKSITE}/${worksite.id}`,
        ]);
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
            name: formValues.name,
            updatedAt: new Date().toISOString(),
            streetAddress: formValues.streetAddress,
            postalCode: formValues.postalCode,
            city: formValues.city,
        };

        this.worksiteService
            .putWorksite(activeWorksite.id, updatedWorksite)
            .subscribe(() => {
                this.worksiteService.updateWorksite(
                    activeWorksite,
                    updatedWorksite
                );

                setTimeout(() => {
                    this.closeModal();
                }, 250);
            });
    }

    postNewWorksite(formValues: Partial<Worksite>) {
        const signedIn = this.authQuery.getSignedInUser();

        const newWorksite: Partial<Worksite> = {
            createdAt: new Date().toISOString(),
            createdBy: signedIn.id,
            updatedAt: new Date().toISOString(),
            updatedBy: signedIn.id,
            name: formValues.name,
            deleted: false,
            info: {
                streetAddress: formValues.streetAddress,
                postalCode: formValues.postalCode,
                city: formValues.city,
            },
            users: [signedIn.id],
            _c: signedIn.clientId,
        };

        this.worksiteService
            .postNewWorksite(newWorksite)
            .subscribe(worksite => {
                this.worksiteService.addNewWorksiteToStore(
                    newWorksite,
                    worksite.id
                );

                setTimeout(() => {
                    this.closeModal();
                }, 250);
            });
    }

    deleteWorksite() {
        if (prompt('Type "remove" to delete worksite') === 'remove') {
            const active = this.worksitesQuery.getActive() as Worksite;
            const user = this.authQuery.getSignedInUser();

            this.worksiteService
                .putWorksite(active.id, {
                    updatedAt: new Date().toISOString(),
                    updatedBy: user.id,
                    deleted: true,
                })
                .subscribe(() => {
                    this.worksiteService.updateDeleted(active, {
                        updatedAt: new Date().toISOString(),
                        updatedBy: user.id,
                        deleted: true,
                    });

                    setTimeout(() => {
                        this.closeModal();
                    }, 250);
                });
        }
    }

    closeModal() {
        this.worksiteService.setActive(null);
        this.manageService.setModal(false);
        this.router.navigate([`${RouterRoutesEnum.MANAGE_WORKSITES}`]);
    }

    worksiteUsers() {
        this.router.navigate(['worksite-users']);
    }

    ngOnDestroy() {
        this.subscriptions.forEach(el => el.unsubscribe());
        this.manageService.subscriptions.forEach(el => el.unsubscribe());
    }
}
