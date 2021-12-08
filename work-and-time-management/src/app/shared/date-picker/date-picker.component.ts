import { Component, OnInit } from '@angular/core';
import * as variables from './date-picker-variables';

@Component({
    selector: 'app-date-picker',
    templateUrl: 'date-picker.component.html',
    styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
    constructor() {}

    public lang = 'en';
    public months: Array<string>;
    public weekdays: Array<string>;

    // displayed date
    public currentMonth;
    public currentYear;
    public daysInPreviousMonthWeek = [];
    public daysInCurrentMonth: Array<{ day: number; status: 'string' }> = [];
    public daysInNextMonthWeek = [];

    // selected day
    private selectedDate = new Date();
    private date = new Date();

    // selectors UI
    public showSelector: variables.ShowSelector = variables.ShowSelector.DAY;
    public showSelectorType = variables.ShowSelector;
    public yearUiArray = new Array(12);
    public yearMultiplier = 0;

    ngOnInit() {
        this.months = variables.MONTHS[this.lang];
        this.weekdays = variables.WEEKDAYS[this.lang];

        this.setCalendar();
    }

    private setCalendar() {
        this.currentMonth = this.date.getMonth();
        this.currentYear = this.date.getFullYear();
        this.getDaysInCalendar();
    }

    changeMonth(next: boolean) {
        this.date.setMonth(
            next ? this.date.getMonth() + 1 : this.date.getMonth() - 1
        );
        this.currentMonth = this.date.getMonth();
        this.currentYear = this.date.getFullYear();
        this.setCalendar();
    }

    navigateSelectors(next: boolean) {
        if (this.showSelector === variables.ShowSelector.YEAR) {
            return this.changeYear(next);
        } else {
            return this.changeMonth(next);
        }
    }

    changeYear(next: boolean) {
        this.yearMultiplier = next
            ? this.yearMultiplier + 12
            : this.yearMultiplier - 12;
    }

    private getDaysInCalendar() {
        // days in current month
        const daysOfCurrentMonth = new Date(
            this.currentYear,
            this.currentMonth + 1,
            0
        ).getDate();
        const currentMonthDays = [];

        for (let i = 0; i < daysOfCurrentMonth; i++) {
            if (
                this.selectedDate.getFullYear() === this.date.getFullYear() &&
                this.selectedDate.getMonth() === this.date.getMonth() &&
                i + 1 === this.selectedDate.getDate()
            ) {
                currentMonthDays.push({
                    day: i + 1,
                    status: 'selected',
                });
            } else {
                currentMonthDays.push({
                    day: i + 1,
                    status: 'available',
                });
            }
        }

        this.daysInCurrentMonth = currentMonthDays;

        // dasy in previous month week
        this.daysInPreviousMonthWeek =
            this.getPreviousMonth(daysOfCurrentMonth);

        // days in next month week
        this.daysInNextMonthWeek = this.getNextMonth();
    }

    private getPreviousMonth(daysOfCurrentMonth): Array<number> {
        const firstDayOfCurrentMonth = new Date(
            this.currentYear,
            this.currentMonth,
            0
        ).getDay();
        const previousWeekDays = [];

        for (let i = 0; i < firstDayOfCurrentMonth; i++) {
            previousWeekDays.push(daysOfCurrentMonth - i);
        }

        return previousWeekDays.reverse();
    }

    private getNextMonth(): Array<number> {
        const lastDayOfMonth = new Date(
            this.currentYear,
            this.currentMonth + 1,
            0
        ).getDay();
        const nextWeekDays = [];

        for (let i = 0; i < 7 - lastDayOfMonth; i++) {
            nextWeekDays.push(i + 1);
        }

        return nextWeekDays;
    }

    selectDate(day: number) {
        this.selectedDate = new Date(this.currentYear, this.currentMonth, day);
        this.getDaysInCalendar();
    }

    selectMonth(month: number) {
        this.date.setMonth(month);
        this.currentMonth = this.date.getMonth();
        this.getDaysInCalendar();

        this.showSelector = variables.ShowSelector.DAY;
    }

    selectYear(year: number) {
        // this.date.setYear(year);
        this.currentYear = this.date.getFullYear();
        this.getDaysInCalendar();

        this.showSelector = variables.ShowSelector.MONTH;
    }

    toggleSelector(selector: variables.ShowSelector) {
        this.showSelector = selector;
    }
}
