import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Worksite } from 'src/app/stores/worksites/state';
import { WorkType } from 'src/app/stores/worktypes/state';
import { DropdownReset } from 'src/app/helpers/interfaces/helpers';

@Component({
  selector: 'app-hours-dropdown',
  templateUrl: './hours-dropdown.component.html',
  styleUrls: ['./hours-dropdown.component.scss']
})
export class HoursDropdownComponent implements OnInit {

  @Output() itemSelection = new EventEmitter();
  @Input()
  set activeSelection(value: Worksite | WorkType) {
    this.selectedItem = value;
  }
  @Input() defaultName = '';
  @Input()
  set content(values: WorkType[] | Worksite[]) {
    this.contents = [...values];
  }

  @Input()
  set setErrors(value: boolean) {
    this.showError = value;
  }

  showError = false;
  contents = [];
  show = false;
  scrollOver = false;
  selectedItem: WorkType | Worksite;

  constructor() { }

  ngOnInit() {
    this.contents.length > 5 ? this.scrollOver = true : this.scrollOver = false;
  }

  dropdownShow() {
    this.show = !this.show;
  }

  selectElement(el: WorkType | Worksite) {
    this.selectedItem = el;
    this.show = !this.show;
    this.itemSelection.emit(el);
  }

  reset() {
    const selItem = this.selectedItem;
    this.selectedItem = undefined;
    this.show = !this.show;

    // TODO
    // add type to worksite and worktype database entity

    // tslint:disable-next-line: no-string-literal
    const nullType: DropdownReset = selItem['streetAddress'] ? { type: 'worksite', id: null } : { type: 'worktype', id: null };
    this.itemSelection.emit(nullType);
  }

  clickOutsideEvent(event: any) {
    this.show = false;
  }
}
