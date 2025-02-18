import { inject, Injectable } from '@angular/core';
import { HttpService } from '../../core/services/http.service';
import { map, type Observable } from 'rxjs';
import type { IGlobal, IPlant, IUser } from '../store/interfaces/store.interface';

export interface IIntialState{
    user: IUser;
    table: IPlant[];
    global:IGlobal;
}

interface IIntialStateApiResponse{
    user: IUser;
    table: IPlant[];
    global:{
      readingsOk: number;
      mediumAlerts: number;
      redAlerts: number;
      disabledSensors: number;
    };
}

@Injectable({
  providedIn: 'root'
})
export class PrivateService {

  readonly #http: HttpService = inject(HttpService);

  public getInitialState(): Observable<IIntialState> {
    return this.#http.get<IIntialStateApiResponse, any>('initial-state', { id: 1 }).pipe(
      map((response:IIntialStateApiResponse) => {
        return {
          user: response.user,
          table: response.table,
          global: {
            totalReadingsOk: response.global.readingsOk,
            totalMediumAlerts: response.global.mediumAlerts,
            totalRedAlerts: response.global.redAlerts,
            totalDisabledSensors: response.global.disabledSensors,
          },
        };
      }));
  }
}
