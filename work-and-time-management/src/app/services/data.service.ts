import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../auth/user/user.model';
import { Worksite } from '../worksites/state/worksites.model';

@Injectable({ providedIn: 'root' })
export class DataService {
    private userUrl = 'api/user';
    private worksitesUrl = 'api/worksites';

    constructor(
        private http: HttpClient
    ) { }

    getUser(): Observable<User> {
        return this.http.get<User>(this.userUrl);
    }

    getWorksites(): Observable<Partial<Worksite>[]> {
        return this.http.get<Partial<Worksite>[]>(this.worksitesUrl);
    }
}
