/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { ButtonComponent } from '../../../../../../../ui/_index';
import type { ICountry, IPlant } from '../../../../../store/interfaces/store.interface';
import { DialogService } from '../../../services/dialog.service';
import { HttpService } from '../../../../../../core/services/http.service';
import { StoreService } from '../../../../../store/service/store.service';
import type { ICreatePlantRequest } from '../../../interface/plant.interface.';
import type { Observable } from 'rxjs';

export interface IEditPlantDialogData {
  data: IPlant;
  countries: ICountry[];
}

@Component({
  selector: 'app-edit-plant-dialog',
  imports: [
    MatDialogModule, MatButtonModule, FormsModule, MatFormFieldModule,
    MatInputModule, ReactiveFormsModule, MatSelectModule, ButtonComponent
  ],
  templateUrl: './component.html',
  styleUrl: './component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditPlantDialog {
  public data = inject<IEditPlantDialogData>(MAT_DIALOG_DATA);
  readonly #dialogService = inject(DialogService);
  readonly #httpService = inject(HttpService);
  readonly #storeService = inject(StoreService);
  readonly #thisDialog = inject(MatDialogRef<EditPlantDialog>);

  public form = new FormGroup({
    name: new FormControl(this.#storeService.selectedPlant().plant?.name ?? '', Validators.required),
    country: new FormControl(this.#storeService.selectedPlant().plant?.country ?? '', Validators.required),
  });

  public matcher = new ErrorStateMatcher();

  public get nameFormControl(): FormControl {
    return (this.form.get('name') as FormControl) ?? new FormControl('');
  }

  public get countryFormControl(): FormControl {
    return (this.form.get('country') as FormControl) ?? new FormControl('');
  }

  private takeFormValues(): IPlant {
    return {
      id: this.data.data.id,
      name: this.nameFormControl.value,
      country: this.countryFormControl.value,
      sensors: this.data.data.sensors,
      readingsOk: this.data.data.readingsOk,
      mediumAlerts: this.data.data.mediumAlerts,
      redAlerts: this.data.data.redAlerts,
      disabledSensors: this.data.data.disabledSensors,
    };
  }

  public edit(): void {
    const plant = this.takeFormValues();

    // Pedir confirmación antes de actualizar
    this.#dialogService.openDialogConfirm({
      title: 'Confirmación',
      message: `¿Está seguro de que desea actualizar los datos de la planta ${this.data.data.name}, ${this.data.data.country.name}?`,
      legendButtonConfirm: 'Confirmar'
    }).afterClosed().subscribe((confirmed: boolean) => {
      if (!confirmed) return;
      this.updatePlant(plant);
    });
  }

  private updatePlant(plant: IPlant): void {
    this.#storeService.setDashboardStatus('LOADING');

    const updatePlant = {
      id: plant.id,
      name: plant.name,
      country: plant.country.name,
      imageUrl: plant.country.imageUrl,
    };

    this.#httpService.put(`plants/${plant.id.toString()}`, updatePlant).subscribe({
      next: () => {
        // Buscar y actualizar la planta editada en el store
        const updatedPlants: IPlant[] = this.#storeService.dashboard().table.plants.map(p =>
          p.id === plant.id ? { ...p, name: plant.name, country: { name: plant.country.name, imageUrl: plant.country.imageUrl } } : p
        );

        this.#storeService.setTable(updatedPlants);

        this.#thisDialog.close();
        this.#dialogService.openDialogSuccess({
          type: 'success',
          text: `La planta ${plant.name}, ${plant.country.name} fue actualizada correctamente`
        });
      },
      error: () => {
        this.#thisDialog.close();
        this.#dialogService.openDialogSuccess({
          type: 'error',
          text: `Se produjo un error al intentar actualizar la planta ${plant.name}, ${plant.country.name}`
        });
      },
      complete: () => {
        this.#storeService.setDashboardStatus('LOADED');
      }
    });
  }

  public putPlant(plant: IPlant): Observable<Partial<ICreatePlantRequest>> {
    const updatePlant = {
      id: plant.id,
      name: plant.name,
      country: plant.country.name,
      imageUrl: plant.country.imageUrl,
    };
    return this.#httpService.put(`plants/${plant.id.toString()}`, updatePlant);
  }
}
