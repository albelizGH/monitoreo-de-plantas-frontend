import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent } from "../../../../../../../ui/button/component";
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import type { ICreatePlantRequest } from '../../../interface/plant.interface.';
import type { ICountry, IPlant } from '../../../../../store/interfaces/store.interface';
import { HttpService } from '../../../../../../core/services/http.service';
import { StoreService } from '../../../../../store/service/store.service';
import { UpdateSensorDialog } from '../update-sensor/component';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'app-new-plant-dialog',
  imports: [MatDialogModule, MatButtonModule, ButtonComponent, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule],
  templateUrl: './component.html',
  styleUrl: './component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NewPlantDialog {
  public data = inject<ICountry[]>(MAT_DIALOG_DATA);
  readonly #httpService: HttpService = inject(HttpService);
  readonly #storeService: StoreService = inject(StoreService);
  readonly #thisDialog: MatDialogRef<UpdateSensorDialog> = inject(MatDialogRef);
  readonly #dialogService: DialogService = inject(DialogService);

  public form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    country: new FormControl('', [Validators.required]),
  });

  public matcher = new ErrorStateMatcher();

  public get nameFormControl(): FormControl {
    return this.form.get('name') as FormControl
  }

  public get selectedValueFormControl(): FormControl {
    return this.form.get('country') as FormControl
  }

  public takeFormValues(): ICreatePlantRequest | undefined {
    if (this.form.valid) {
      const plant: ICreatePlantRequest = {
        name: this.nameFormControl.value,
        country: this.selectedValueFormControl.value['name'],
        imageUrl: this.selectedValueFormControl.value['imageUrl']
      };
      return plant;
    }
    return undefined;
  }

  public create(): void {
    const plant = this.takeFormValues();
    if (plant) {
      // Se crea la planta con id=-1, una vez creada le cambio el id con la respuesta del servidor y si da error el servidor se muestra un mensaje de error
      //De esta manera se le da al usuario una impresión de velocidad en la creación de la planta
      // Creo una nueva planta con los datos que me devolvió el servidor y la agrego al store
      const newPlant: IPlant = {
        id: -1,
        name: plant.name,
        country: { name: plant.country, imageUrl: plant.imageUrl },
        sensors: [],
        readingsOk: 0,
        mediumAlerts: 0,
        redAlerts: 0,
        disabledSensors: 0
      };
      const plants = [...this.#storeService.dashboard().table.plants, newPlant];
      this.#storeService.setTable(plants);
      this.#thisDialog.close();
      this.#dialogService.openDialogSuccess({ type: 'success', text: `La planta ${plant.name}, ${plant.country} fue creada correctamente` });
      this.#httpService.post<ICreatePlantRequest, Partial<IPlant>>('plants', plant).subscribe({
        next: (res) => {
          // Actualizo la planta con el id que me devolvió el servidor
          const newPlant: IPlant = {
            id: res.id??-1,
            name: plant.name,
            country: { name: plant.country, imageUrl: plant.imageUrl },
            sensors: [],
            readingsOk: 0,
            mediumAlerts: 0,
            redAlerts: 0,
            disabledSensors: 0
          };
          // Elimino de la tabla la planta con id=-1 y agrego la planta con el id que me devolvió el servidor
          const plants = this.#storeService.dashboard().table.plants.filter(p => p.id !== -1);
          this.#storeService.setTable([...plants, newPlant]);
        },
        error: () => {
          // Si hay un error al crear la planta muestro un mensaje de error y elimino la planta con id=-1 de la tabla
          const plants = this.#storeService.dashboard().table.plants.filter(p => p.id !== -1);
          this.#storeService.setTable(plants)
          this.#thisDialog.close();
          this.#dialogService.openDialogSuccess({ type: 'error', text: `Se produjo un error al intentar crear la planta ${plant.name}, ${plant.country}` });
        },
      });
    }
  }
}
