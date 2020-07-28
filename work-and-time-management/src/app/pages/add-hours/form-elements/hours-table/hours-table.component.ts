import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Hours } from 'src/app/auth/hours';

@Component({
    selector: 'app-hours-table',
    templateUrl: './hours-table.component.html',
    styleUrls: ['./hours-table.component.scss']
})
export class HoursTableComponent implements OnInit {

    @Input() tableHours: object[];
    @Output() hoursSelection = new EventEmitter();

    dayTableSelectionIndex;
    previousTableSelectionIndex;

    constructor() { }

    ngOnInit() { }

    // selectDayTableHour(hours: Partial<Hours>, index: number) {
    //     if (
    //         this.previousTableSelectionIndex !== index ||
    //         this.dayTableSelectionIndex === undefined
    //     ) {
    //         this.dayTableSelectionIndex = index;
    //         this.hoursSelection.emit(hours);
    //     } else {
    //         this.dayTableSelectionIndex = undefined;
    //     }
    //     this.previousTableSelectionIndex = index;
    // }

    selectDayTableHour(hours: Partial<Hours>, index: number) {
        if (
            this.previousTableSelectionIndex !== index ||
            this.dayTableSelectionIndex === undefined
        ) {
            this.dayTableSelectionIndex = index;
            this.hoursSelection.emit(hours);
        } else {
            console.log('RESET');
            this.dayTableSelectionIndex = undefined;
            this.hoursSelection.emit({ message: 'reset' });
        }
        this.previousTableSelectionIndex = index;
    }
}
