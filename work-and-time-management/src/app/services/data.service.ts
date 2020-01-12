import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../auth/user/user.model';

@Injectable({ providedIn: 'root' })
export class DataService {
    private userUrl = 'api/user';

    constructor(
        private http: HttpClient
    ) { }

    /** GET heroes from the server */
    getUser(): Observable<User> {
        return this.http.get<User>(this.userUrl);
    }
}
