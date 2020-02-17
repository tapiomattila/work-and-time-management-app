import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  constructor() { }

  createDb() {
    const user = { id: 'h98hsd98h', name: 'John Doe' };
    const worksites = [
      {
        id: '4232013j',
        nickname: 'Ravattula',
        streetAddress: 'Reivikatu 5-7',
        postalCode: 20540,
        city: 'Turku',
        createdAt: '2020-02-12T19:17:08.479Z',
        updatedAt: '2020-02-13T19:27:08.479Z'
      },
      {
        id: '1232013j',
        nickname: 'Ruissalon kylpylä',
        streetAddress: 'Ruissalon puistotie 640',
        postalCode: 20100,
        city: 'Turku',
        createdAt: '2020-02-13T19:56:08.479Z',
        updatedAt: '2020-02-14T19:11:08.479Z'
      },
      {
        id: '2232013j',
        nickname: 'Ylioppilaskylä',
        streetAddress: 'Ylioppilaskylä 12A',
        postalCode: 20540,
        city: 'Turku',
        createdAt: '2020-02-10T12:45:08.479Z',
        updatedAt: '2020-02-16T15:32:08.479Z'
      },
      {
        id: '3242013j',
        nickname: 'Caribia',
        streetAddress: 'Kongressikuja 1',
        postalCode: 20540,
        city: 'Turku',
        createdAt: '2020-02-17T11:12:08.479Z',
        updatedAt: '2020-02-17T17:50:08.479Z'
      }
    ];
    return { user, worksites };
  }
}
