import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { Hours } from 'src/app/auth/hours';
import { fadeInEnterTrigger } from 'src/app/animations/animations';
import { Hours } from 'src/app/stores/hours';

@Component({
    selector: 'app-hours-table',
    templateUrl: './hours-table.component.html',
    styleUrls: ['./hours-table.component.scss'],
    animations: [
        fadeInEnterTrigger
    ]
})
export class HoursTableComponent implements OnInit {

    @Output() hoursSelection = new EventEmitter();

    @Input() tableHours: object[];
    @Input()
    set changeIndex(value: number) {
        if (value === 111) {
            this.dayTableSelectionIndex = undefined;
            this.hoursSelection.emit({ message: 'reset' });
        }
    }

    dayTableSelectionIndex;
    previousTableSelectionIndex;

    constructor() { }

    ngOnInit() { }

    selectDayTableHour(hours: Partial<Hours>, index: number) {
        if (
            this.previousTableSelectionIndex !== index ||
            this.dayTableSelectionIndex === undefined
        ) {
            this.dayTableSelectionIndex = index;
            this.hoursSelection.emit(hours);
        } else {
            this.dayTableSelectionIndex = undefined;
            this.hoursSelection.emit({ message: 'reset' });
        }
        this.previousTableSelectionIndex = index;
    }
}
