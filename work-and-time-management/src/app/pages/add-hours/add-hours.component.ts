import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { WorksitesQuery, Worksite, WorksitesService } from '../worksites/state';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RouterRoutesEnum } from 'src/app/enumerations/global.enums';
import { Observable, Subscription } from 'rxjs';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WorkType, WorkTypeQuery, WorkTypeService } from 'src/app/worktype/state';
import { map, distinctUntilChanged, delay } from 'rxjs/operators';
import { HoursQuery, Hours, HoursService, TableHours } from 'src/app/auth/hours';
import { UserQuery } from 'src/app/auth/user';
import { formatHours } from 'src/app/helpers/helper-functions';
import { fadeInEnterTrigger, fadeInOutTrigger } from 'src/app/animations/animations';

interface FormData {
    date: Date;
    slider: number;
    worksite: Worksite;
    worktype: WorkType;
}

@Component({
    selector: 'app-add-hours',
    templateUrl: './add-hours.component.html',
    styleUrls: ['./add-hours.component.scss'],
    animations: [
        fadeInOutTrigger
    ]
})
export class AddHoursComponent implements OnInit, AfterViewInit, OnDestroy {
    subscriptions: Subscription[] = [];
    setTableIndex;
    showFormData = true;

    slider$: Observable<number>;

    worksite$: Observable<Worksite>;
    worktype$: Observable<WorkType>;

    worksites$: Observable<Worksite[]>;
    worktypes$: Observable<WorkType[]>;

    dayHours$: Observable<string>;
    dayTableHours$: Observable<object[]>;
    activeHours$: Observable<Hours>;

    dataForm: FormGroup;
    momentDay: moment.Moment;

    loader = true;

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

        this.worksite$ = this.worksiteQuery.selectActiveWorksite();
        this.worktype$ = this.worktypeQuery.selectActiveWorktype();

        this.selectionDayHours();
        this.formValueChanges();
        this.setTableHours(new Date());

        this.slider$ = this.dataForm.controls.slider.valueChanges;
        this.activeHours$ = this.hoursQuery.selectActiveHours();

        this.subscriptions.push(activeWorktypeSubs);
    }

    ngAfterViewInit() { }

    selectionDayHours() {
        this.dayHours$ = this.worksiteQuery.selectHoursForSelectedDay()
            .pipe(
                map(el => {
                    return formatHours(el);
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
                    this.setTableHours(data.date);
                }
            });
    }

    setTableHours(date: Date) {
        this.dayTableHours$ = this.hoursQuery.selectHoursForDay(date.getTime(), this.worksiteQuery.getActiveId())
            .pipe(
                map(elements => {
                    return this.worksiteQuery.selectTableHours(elements);
                }),
            );
    }

    showFormToggleEmit(event) {
        this.showFormData = event;
    }

    initForm() {
        this.dataForm = new FormGroup({
            date: new FormControl(new Date(), Validators.required),
            worksite: new FormControl(null, Validators.required),
            worktype: new FormControl(null, Validators.required),
            slider: new FormControl(null, [Validators.required, this.sliderValidator.bind(this)])
        });
    }

    sliderValidator(control: FormControl): { [s: string]: boolean } {
        if (control.value === 0) {
            return { message: true };
        }
        return null;
    }

    getItemSelectionFromDropdown(item: Worksite | WorkType) {
        const itemWorksite = this.worksiteQuery.getAll().find(el => el.id === item.id);
        const itemWorktype = this.worktypeQuery.getAll().find(el => el.id === item.id);

        if (itemWorksite) {
            this.worksiteService.setActive(item.id);
            this.resetTableSelection();
            this.resetSlider();
        }

        if (itemWorktype) {
            this.worktypeService.setActive(item.id);
        }
    }

    backArrowPressed() {
        this.router.navigate([RouterRoutesEnum.DASHBOARD]);
    }

    onSubmit() {
        if (!this.dataForm.valid) {
            return;
        }
        const values = this.dataForm.value as FormData;

        // POST
        if (!this.hoursQuery.getActive()) {
            this.postHours(values);
        }

        // UPDATE
        if (this.hoursQuery.getActive()) {
            this.updateHours(values);
        }
    }

    remove() {
        if (this.hoursQuery.getActive()) {
            const active = this.hoursQuery.getActive() as Hours;
            const id = active.id;
            // REMOVE
            this.hoursService.deleteHours(id).subscribe(() => {
                this.hoursService.removeHours(id);
                this.resetSlider();
                this.resetTableSelection();
            });
        }
    }

    getHoursSelectionFromTable(hours: TableHours | { message: string }) {
        // tslint:disable-next-line: no-string-literal
        const id = hours['id'];

        if (id) {
            const hour = hours as TableHours;
            this.hoursService.setActive(hour.id);
            this.worktypeService.setActive(hour.worktypeId);
            this.dataForm.controls.slider.setValue(hour.hours);
        } else {
            this.hoursService.setActive(null);
            this.resetSlider();
            this.resetTableSelection();
        }
    }

    resetSlider() {
        this.dataForm.controls.slider.setValue(0);
    }

    resetWorktype() {
        this.dataForm.controls.worktype.setValue(null);
    }

    resetTableSelection() {
        this.setTableIndex = 1;
        setTimeout(() => {
            this.setTableIndex = undefined;
        }, 200);
    }

    postHours(values: FormData) {
        const newHours: Partial<Hours> = {
            userId: this.userQuery.getValue().id,
            createdAt: values.date.toISOString(),
            markedHours: values.slider,
            updatedAt: values.date.toISOString(),
            worksiteId: values.worksite.id,
            worktypeId: values.worktype.id
        };
        this.hoursService.postNewHours(newHours).subscribe(() => {
            console.log('POST');
            this.hoursService.setUserHours(this.userQuery.getValue().id).subscribe();
            this.resetSlider();
        });
    }

    updateHours(values: FormData) {
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

    ngOnDestroy() {
        if (this.subscriptions.length) {
            this.subscriptions.forEach(el => el.unsubscribe());
        }
    }

}
