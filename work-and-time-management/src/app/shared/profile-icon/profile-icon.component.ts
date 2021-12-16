import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-profile-icon',
    templateUrl: './profile-icon.component.html',
    styleUrls: ['./profile-icon.component.scss'],
})
export class ProfileIconComponent implements OnInit {

    profileIconUrl = '';

    @Input()
    set pic(value: string) {
        value ? this.profileIconUrl = value : this.profileIconUrl = '';
    }
    iconUrl = '../../../../assets/svg/sprite.svg#icon-user';

    constructor() {}

    ngOnInit(): void {}
}
