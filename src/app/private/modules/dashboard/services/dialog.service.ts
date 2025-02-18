/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { inject, Injectable } from '@angular/core';
import { NewPlantDialog } from '../components/dialogs/new-plant-dialog/component';
import { DashboardHttpService } from './dashboard-http.service';
import { MatDialog } from '@angular/material/dialog';
import type { ISuccessfulDialogData} from '../components/dialogs/successful-dialog/component';
import { SuccessfulDialog } from '../components/dialogs/successful-dialog/component';
import type { ICountry, IPlant, IReading } from '../../../store/interfaces/store.interface';
import type { IConfirmDialogData } from '../components/dialogs/confirm-dialog/component';
import { ConfirmDialog } from '../components/dialogs/confirm-dialog/component';
import type { IEditPlantDialogData } from '../components/dialogs/edit-plant-dialog/component';
import { EditPlantDialog } from '../components/dialogs/edit-plant-dialog/component';
import { UpdateSensorDialog } from '../components/dialogs/update-sensor/component';

@Injectable({
  providedIn: 'root'
})
export class DialogService {

    readonly #dashboardService: DashboardHttpService = inject(DashboardHttpService);
    readonly #dialog = inject(MatDialog);
    

    public openNewPlantDialog(countries: ICountry[]) {
        const sortedCountries = countries.sort((a, b) => a.name.localeCompare(b.name));
        const dialogRef = this.#dialog.open(NewPlantDialog, {
            data: sortedCountries,
            minHeight: '320px',
            width: '600px',
        });
        return dialogRef;
    }

    public openDialogSuccess(detail: ISuccessfulDialogData):any {
        const dialogRef = this.#dialog.open(SuccessfulDialog, {
          data: detail,
          minHeight: '300px',
          width: '600px',
        });
        return dialogRef;
      }

      public openDialogEditSensor(sensor: IReading): any {
          const data= sensor;
          const dialogRef = this.#dialog.open(UpdateSensorDialog, {
            data: data,
            minHeight: '320px',
            width: '600px',
          });
          return dialogRef;
        }


        public openDialogConfirm(data:IConfirmDialogData):any {
            const dialogRef = this.#dialog.open(ConfirmDialog, {
              data: data,
              minHeight: '200px',
              width: '600px',
            });
            return dialogRef;
        }

        public openDialogEditPlant(countries: ICountry[],plant:IPlant) {
            const sortedCountries = countries.sort((a, b) => a.name.localeCompare(b.name));
            const data: IEditPlantDialogData = {data:plant,countries:sortedCountries};
            const dialogRef = this.#dialog.open(EditPlantDialog, {
                minHeight: '320px',
                width: '600px',
                data:data
            });
            return dialogRef;
        }
        

}
