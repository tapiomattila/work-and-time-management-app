import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Worksite } from 'src/app/pages/worksites/state';
import { WorkType } from 'src/app/pages/worktype/state';

@Component({
    selector: 'app-hours-dropdown',
    templateUrl: './hours-dropdown.component.html',
    styleUrls: ['./hours-dropdown.component.scss']
})
export class HoursDropdownComponent implements OnInit {

    model: any;
    itemsArr: any[];
    @Input() parentForm: FormGroup;
    @Input() controlName: string;
    @Input() header: string;

    @Input()
    set items(vals: any[]) {
        if (vals) {
            this.itemsArr = vals;
        }
    }

    @Input()
    set modelX(value: any) {
        if (value) {
            this.model = value;
        }
    }

    @Output() itemSelection = new EventEmitter();

    constructor() { }

    ngOnInit() { }

    itemOption(item: Worksite | WorkType) {
        this.itemSelection.emit(item);
    }
}
