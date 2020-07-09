import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { WorksitesQuery, Worksite, WorksitesService } from '../worksites/state';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { RouterRoutesEnum } from 'src/app/enumerations/global.enums';
import { switchMap } from 'rxjs/operators';
import { of, Observable, Subscription, BehaviorSubject } from 'rxjs';
import * as moment from 'moment';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { WorkType } from 'src/app/worktype/state/worktype.model';
import { WorkTypeQuery } from 'src/app/worktype/state/worktype.query';

@Component({
    selector: 'app-add-hours',
    templateUrl: './add-hours.component.html',
    styleUrls: ['./add-hours.component.scss']
})
export class AddHoursComponent implements OnInit, AfterViewInit, OnDestroy {
    private sliderValueSubj = new BehaviorSubject(0);
    sliderValue$ = this.sliderValueSubj.asObservable();

    subscriptions: Subscription[] = [];

    worksite$: Observable<Worksite>;
    worksites$: Observable<Worksite[]>;
    worktypes$: Observable<WorkType[]>;
    selectedWorksiteValue: string;
    dataForm: FormGroup;
    maxDate = new Date();

    step = 0.25;
    sliderMin = 0;
    sliderMax = 16;

    momentDay: moment.Moment;

    constructor(
        private worksiteQuery: WorksitesQuery,
        private worksiteService: WorksitesService,
        private worktypeQuery: WorkTypeQuery,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit() {
        this.worksites$ = this.worksiteQuery.selectAll();
        this.worktypes$ = this.worktypeQuery.selectAll();
        this.initForm();

        // this.sliderValue$.subscribe(res => console.log('show slider value', res));
        // this.worktypes$.subscribe(res => console.log('show worktypse', res));
        // this.sliderValue$.subscribe(res => console.log('show ere in slider', res));

        this.momentDay = moment();

        this.route.params.subscribe((params: Params) => {
            if (params.id) {
                this.worksiteService.setActive(params.id);
            }
        });

        const activeWorksite$ = this.worksiteQuery.selectActiveId().pipe(
            switchMap(id => id ? this.worksiteQuery.selectEntity(id) : of(null))
        );

        this.worksite$ = activeWorksite$;

        this.dataForm.valueChanges.subscribe(data => {
            this.momentDay = moment(data.date);
        });

        const activeWorkSiteSubs = activeWorksite$.subscribe((active: Worksite) => {
            if (active) {
                this.selectedWorksiteValue = active.nickname;
            }
        });

        this.subscriptions.push(activeWorkSiteSubs);
    }

    ngAfterViewInit() {
    }

    initForm() {
        this.dataForm = new FormGroup({
            date: new FormControl(new Date(), Validators.required),
            worksite: new FormControl(null, Validators.required),
            worktype: new FormControl(null, Validators.required),
            slider: new FormControl(null, Validators.required)
        });
    }

    formatLabel(value: number) {
        if (value >= 1000) {
            return Math.round(value / 1000) + 'k';
        }
        return value + 'h';
    }

    updateSlider(event: any) {
        this.updateSliderSubject(event.value);
    }

    updateSliderSubject(value: number) {
        this.sliderValueSubj.next(value);
    }

    backArrowPressed() {
        this.router.navigate([RouterRoutesEnum.DASHBOARD]);
    }

    toggleDatePicker(picker) {
        picker.open();
    }

    onSubmit() {
        if (!this.dataForm.valid) {
            console.log('INVALID FORM');
            return;
        }

        const values = this.dataForm.value;
        const data = {
            date: new Date(),
            worksite: values.worksite,
            worktype: values.worktype,
            time: values.slider
        };
        console.log('show data ', data);
    }

    ngOnDestroy() {
        if (this.subscriptions.length) {
            this.subscriptions.forEach(el => el.unsubscribe());
        }
    }

}
