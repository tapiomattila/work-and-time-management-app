import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { fadeInEnterTrigger } from 'src/app/animations/animations';

@Component({
    selector: 'app-hours-date-selection',
    templateUrl: './hours-date-selection.component.html',
    styleUrls: ['./hours-date-selection.component.scss'],
    animations: [
        fadeInEnterTrigger
    ],
})
export class HoursDateSelectionComponent implements OnInit {

    private showFormData = true;
    tableContentValues;

    @Input()
    set tableContent(content: object[]) {
        if (content && content.length) {
            this.tableContentValues = content;
        } else {
            this.tableContentValues = undefined;
        }
    }

    @Input() parentForm: FormGroup;
    @Input() controlName: string;
    @Output() showForm = new EventEmitter();

    maxDate = new Date();

    constructor() { }

    ngOnInit() { }

    toggleDatePicker(picker) {
        picker.open();
    }

    toggleFormData() {
        this.showFormData = !this.showFormData;
        this.showForm.emit(this.showFormData);
    }
}
