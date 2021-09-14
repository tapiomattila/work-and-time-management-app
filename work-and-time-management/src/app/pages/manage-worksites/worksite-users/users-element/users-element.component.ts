import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { User } from 'src/app/stores/users';
import { Worksite } from 'src/app/stores/worksites/state';

@Component({
  selector: 'app-users-element',
  templateUrl: './users-element.component.html',
  styleUrls: ['./users-element.component.scss']
})
export class UsersElementComponent implements OnInit {

  @Output() worksiteUserChange = new EventEmitter<{ userId: string, worksiteId: string, checked: boolean }>();

  usersMapped: {
    uniqId: string,
    id: string,
    firstName: string,
    lastName: string,
    email: string,
  }[];

  @Input()
  set users(value: User[]) {
    this.usersMapped = value.map(el => {
      return {
        uniqId: this.uniqID(),
        id: el.userId,
        firstName: el.info.firstName,
        lastName: el.info.lastName,
        email: el.info.email
      };
    });
  }

  @Input() worksite: Worksite;

  constructor() { }

  ngOnInit() { }

  setNewChecked(event: any, user: {
    uniqId: string,
    id: string,
    firstName: string,
    lastName: string,
    email: string
  }) {
    this.worksiteUserChange.emit({
      userId: user.id,
      worksiteId: this.worksite.id,
      checked: event
    });
  }

  getChecked(id: string) {
    return this.worksite.users.includes(id);
  }

  uniqID() {
    return '_' + Math.random().toString(36).substr(2, 9);
  }
}
