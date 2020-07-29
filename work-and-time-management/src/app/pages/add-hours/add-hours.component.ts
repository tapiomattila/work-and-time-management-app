import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { WorksitesQuery, Worksite, WorksitesService } from '../worksites/state';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RouterRoutesEnum } from 'src/app/enumerations/global.enums';
import { Observable, Subscription, of, BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WorkType, WorkTypeQuery, WorkTypeService } from 'src/app/worktype/state';
import { map, distinctUntilChanged, delay } from 'rxjs/operators';
import { HoursQuery, Hours, HoursService } from 'src/app/auth/hours';
import { UserQuery } from 'src/app/auth/user';

@Component({
    selector: 'app-add-hours',
    templateUrl: './add-hours.component.html',
    styleUrls: ['./add-hours.component.scss']
})
export class AddHoursComponent implements OnInit, AfterViewInit, OnDestroy {

    private sliderValueSubj = new BehaviorSubject<string>('0h');
    sliderValueObs$ = this.sliderValueSubj.asObservable();

    setTableIndex;
    showFormData = true;

    slider$: Observable<number>;

    subscriptions: Subscription[] = [];

    worksite$: Observable<Worksite>;
    worksiteNickname$: Observable<string>;

    worktype$: Observable<WorkType>;
    worktypeViewName$: Observable<string>;

    worksites$: Observable<Worksite[]>;
    worktypes$: Observable<WorkType[]>;

    dayHours$: Observable<string>;
    dayTableHours$: Observable<object[]>;
    activeHours$: Observable<Hours>;

    dataForm: FormGroup;
    momentDay: moment.Moment;

    constructor(
        private worksiteQuery: WorksitesQuery,
        private worksiteService: WorksitesService,
        private worktypeQuery: WorkTypeQuery,
        private hoursQuery: HoursQuery,
        private route: ActivatedRoute,
        private userQuery: UserQuery,
        private hoursService: HoursService,
        private worktypeService: WorkTypeService,
        private router: Router
    ) { }

    ngOnInit() {
        this.worksites$ = this.worksiteQuery.selectAll();
        this.worktypes$ = this.worktypeQuery.selectAll();

        const activeWorktypeSubs = this.worktypes$.subscribe(res => {
            if (res && res.length) {
                this.worktypeService.setActive(res[0].id);
            }
        });

        this.initForm();
        this.momentDay = moment();
        this.worksiteQuery.setAddHoursDateSelection(new Date().getTime());

        this.route.params.subscribe((params: Params) => {
            if (params.id) {
                this.worksiteService.setActive(params.id);
            }
        });

        this.worksiteQuery.selectActiveWorksite().subscribe(res => console.log('show active', res));

        const activeWorksite$ = this.worksiteQuery.selectActiveWorksite();
        const activeWorktype$ = this.worktypeQuery.selectActiveWorktype();
        this.worksite$ = activeWorksite$;
        this.worktype$ = activeWorktype$;

        this.worksiteNickname$ = activeWorksite$.pipe(
            map((el: Worksite) => el ? el.nickname : null),
        );

        this.worktypeViewName$ = activeWorktype$.pipe(
            map((el: WorkType) => el ? el.viewName : null)
        );

        this.selectionDayHours();
        this.formValueChanges();

        this.slider$ = this.dataForm.controls.slider.valueChanges;
        this.activeHours$ = this.hoursQuery.selectActiveHours();

        this.subscriptions.push(activeWorktypeSubs);

        const date = new Date();
        this.setDateTEST(date);
    }

    ngAfterViewInit() { }

    selectionDayHours() {
        this.dayHours$ = this.worksiteQuery.selectHoursForSelectedDay()
            .pipe(
                map(el => {
                    return this.formatHours(el);
                })
            );
    }

    formValueChanges() {
        this.dataForm.valueChanges
            .pipe(
                distinctUntilChanged(),
                delay(100)
            ).subscribe(data => {
                this.momentDay = moment(data.date);
                if (data.date) {
                    const date = data.date as Date;
                    this.worksiteQuery.setAddHoursDateSelection(date.getTime());
                    this.setDateTEST(data.date);
                }
            });
    }

    setDateTEST(date: Date) {
        this.dayTableHours$ = this.hoursQuery.selectHoursForDay(date.getTime(), this.worksiteQuery.getActiveId())
            .pipe(
                map(elements => {
                    console.log('show elements', elements);
                    return elements.map(el => {
                        const worksiteName = this.worksiteQuery.getWorksiteById(el.worksiteId);
                        const worksiteNameFound = worksiteName ? worksiteName[0].nickname : undefined;

                        const worktypeId = this.hoursQuery.getHourWorktype(el.id);
                        const worktype = this.worktypeQuery.getWorktypeById(worktypeId);
                        const worktypeNameFound = worktype ? worktype.viewName : undefined;

                        const formattedDate = moment(el.updatedAt).format('DD.MM.YYYY');
                        const hoursFormatted = this.formatHours(el.markedHours);

                        return {
                            id: el.id,
                            createdAt: el.createdAt,
                            updateAt: el.updatedAt,
                            updateAtFormatted: formattedDate,
                            worksiteId: el.worksiteId,
                            worksiteName: worksiteNameFound,
                            worktypeId,
                            worktypeName: worktypeNameFound,
                            hours: el.markedHours,
                            hoursFormatted
                        };
                    });
                }),
            );
    }

    formatHours(hours: number) {
        const frac = hours % 1;

        if (frac === 0) {
            return `${hours.toString()}h`;
        }

        const full = hours - frac;
        return `${full}h ${frac * 60}min`;
    }

    showFormToggleEmit(event) {
        this.showFormData = event;
    }

    initForm() {
        this.dataForm = new FormGroup({
            date: new FormControl(new Date(), Validators.required),
            worksite: new FormControl(null, Validators.required),
            worktype: new FormControl(null, Validators.required),
            slider: new FormControl(null, Validators.required)
        });
    }

    getItemSelectionFromDropdown(item: Worksite | WorkType) {
        const itemWorksite = this.worksiteQuery.getAll().find(el => el.id === item.id);
        const itemWorktype = this.worktypeQuery.getAll().find(el => el.id === item.id);

        if (itemWorksite) {
            this.worksiteService.setActive(item.id);
        }

        if (itemWorktype) {
            this.worktypeService.setActive(item.id);
        }
    }

    backArrowPressed() {
        this.router.navigate([RouterRoutesEnum.DASHBOARD]);
    }

    onSubmit() {

        console.log('show in submit', this.dataForm.value);

        if (!this.dataForm.valid) {
            console.warn('INVALID FORM');
            return;
        }
        const values = this.dataForm.value;

        console.log('show values', values);

        const newHours: Partial<Hours> = {
            userId: this.userQuery.getValue().id,
            createdAt: new Date().toISOString(),
            markedHours: values.slider,
            updatedAt: new Date().toISOString(),
            worksiteId: values.worksite.id,
            worktypeId: values.worktype.id
        };

        // POST
        if (!this.hoursQuery.getActive()) {
            this.hoursService.postNewHours(newHours).subscribe(() => {
                console.log('POST');
                this.hoursService.setUserHours(this.userQuery.getValue().id).subscribe();
                this.resetSlider();
            });
        }

        // UPDATE
        if (this.hoursQuery.getActive()) {
            const updatedHours: Partial<Hours> = {
                markedHours: values.slider,
                updatedAt: new Date().toISOString(),
                worksiteId: values.worksite.id,
                worktypeId: values.worktype.id
            };

            const hours = this.hoursQuery.getActive() as Hours;
            this.hoursService.putHours(hours.id, updatedHours).subscribe(() => {

                console.log('UPDATE');
                this.hoursService.updateHours(hours, updatedHours);
                this.getHoursSelectionFromTable({ message: 'reset' });
                this.setTableIndex = 1;
                setTimeout(() => {
                    this.setTableIndex = undefined;
                }, 200);
            });
        }
    }

    remove() {
        if (this.hoursQuery.getActive()) {
            const active = this.hoursQuery.getActive() as Hours;
            const id = active.id;

            // REMOVE
            this.hoursService.deleteHours(id).subscribe(() => {

                console.log('REMOVE');
                this.hoursService.removeHours(id);
                this.resetSlider();
                this.resetTableSelection();
            });
        }
    }

    getHoursSelectionFromTable(hours: object | { message: string }) {

        // console.log('show emit reset', hours);

        // tslint:disable-next-line: no-string-literal
        if (hours['id']) {

            console.log('SELECTED');

            const test = hours as Partial<Hours>;
            this.hoursService.setActive(test.id);
            this.worktypeService.setActive(test.worktypeId);

            // tslint:disable-next-line: no-string-literal
            this.dataForm.controls.slider.setValue(hours['hours']);

            // tslint:disable-next-line: no-string-literal
            console.log('show format', this.formatHours(hours['hours']));
            const formatHours = this.formatHours(hours['hours']);
            // this.sliderValue = formatHours;
            this.sliderValueSubj.next(formatHours);
        }

        // tslint:disable-next-line: no-string-literal
        if (!hours['id']) {

            console.log('RESET');

            const test2 = hours as { message: string };
            console.log('show test2', test2.message);

            this.hoursService.setActive(null);
            this.resetSlider();
            this.resetTableSelection();
        }
    }

    resetSlider() {
        console.log('RESET SLIDER');
        this.dataForm.controls.slider.setValue(0);
        this.sliderValueSubj.next('0h');
    }

    resetTableSelection() {
        console.log('RESET TABLE SELECTION');
        this.setTableIndex = 1;
        setTimeout(() => {
            this.setTableIndex = undefined;
        }, 200);
    }

    ngOnDestroy() {
        if (this.subscriptions.length) {
            this.subscriptions.forEach(el => el.unsubscribe());
        }
    }

}
