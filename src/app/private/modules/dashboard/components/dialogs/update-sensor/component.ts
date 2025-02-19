/* eslint-disable @typescript-eslint/prefer-destructuring */
/* eslint-disable @typescript-eslint/class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/member-ordering */
import { ChangeDetectionStrategy, Component, EventEmitter, inject, Output } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import type { IGlobal, IPlant, IReading, ISensorSelected } from '../../../../../store/interfaces/store.interface';
import { ButtonComponent } from '../../../../../../../ui/_index';
import { MatMenuModule } from '@angular/material/menu';
import { StoreService } from '../../../../../store/service/store.service';
import { HttpService } from '../../../../../../core/services/http.service';
import { DialogService } from '../../../services/dialog.service';



@Component({
  selector: 'app-update-sensor-dialog',
  imports: [MatDialogModule, MatButtonModule, ButtonComponent, FormsModule, MatFormFieldModule, MatInputModule, ReactiveFormsModule, MatSelectModule,MatMenuModule],
  templateUrl: './component.html',
  styleUrl: './component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class UpdateSensorDialog  {

  public data = inject<IReading>(MAT_DIALOG_DATA);
  readonly #httpService: HttpService = inject(HttpService);
  readonly #store: StoreService = inject(StoreService);
  public readonly state = this.#store.state();
  readonly #dialogService = inject(DialogService);
  readonly #thisDialog: MatDialogRef<UpdateSensorDialog> = inject(MatDialogRef);


  public icon:string;

  public constructor(){
    this.icon=((this.#store.selectedSensor().sensor?.disabled) ?? false)?'sensors_off':'sensors';
  }

  public maxValueReadings=9999;
  public minValueReadings=1;

  public form = new FormGroup({
      name: new FormControl(this.data.name, [Validators.required]),
      readingsOk: new FormControl(this.data.readingsOk.toString(), [Validators.required, Validators.min(this.minValueReadings), Validators.max(this.maxValueReadings)]),
      mediumAlerts: new FormControl(this.data.mediumAlerts.toString(), [Validators.required, Validators.min(this.minValueReadings), Validators.max(this.maxValueReadings)]),
      highAlerts: new FormControl(this.data.redAlerts.toString(), [Validators.required, Validators.min(this.minValueReadings), Validators.max(this.maxValueReadings)]),
  });



  public matcher = new ErrorStateMatcher();

  public get nameFormControl(): FormControl {
      return this.form.get('name') as FormControl
  }

  public get readingsFormControl(): FormControl {
      return this.form.get('readingsOk') as FormControl
  }

  public get mediumAlertsFormControl(): FormControl {
      return this.form.get('mediumAlerts') as FormControl
  }

  public get highAlertsFormControl(): FormControl {
      return this.form.get('highAlerts') as FormControl
  }

    



  public takeFormValues():IReading|null {
    if(this.form.invalid) return null;
      const reading:IReading = {
      id: this.data.id,
      name: this.nameFormControl.value,
      disabled: this.data.disabled,
      readingsOk: parseInt(this.readingsFormControl.value),
      mediumAlerts: parseInt(this.mediumAlertsFormControl.value),
      redAlerts: parseInt(this.highAlertsFormControl.value)
    }
    return reading;
  }

    
  public onEdit(): void { 
    const newSensor = this.takeFormValues();

    if(newSensor===null) return;

    if (newSensor) {
      
      // Pedir confirmación
      const confirmDialog = this.#dialogService.openDialogConfirm(
        { 
          title: 'Confirmación',
          message: `¿Está seguro de que desea actualizar los datos del sensor de ${this.#store.dashboard().selected.sensor.sensor?.name ?? 'sensor'}?`,
          legendButtonConfirm: 'Confirmar'
        }
      );
      
      confirmDialog.afterClosed().subscribe((result: boolean) => {        
        if (!result) {
          return;
        }
        
        // Comparar si los datos del sensor nuevo son iguales a los actuales
        const currentSensor:IReading | null = this.#store.dashboard().selected.sensor.sensor;
        if(currentSensor){
          if (this.areSensorsEqual(currentSensor, newSensor)) {
            confirmDialog.close();
            this.#dialogService.openDialogSuccess({type: 'success', text: `El sensor de ${newSensor.name} se ha actualizado correctamente`});
            return; // No hacer la petición
          }
        }

        //Tomamos el sensor viejo lo editamos y lo cambiamos localmente, si falla la petición se vuelve a su estado anterior
        const oldSensor = this.#store.dashboard().selected.sensor.sensor;
        // Si los sensores son diferentes, continuar con la actualización
        const sensor = this.takeFormValues();
        if (!sensor) return;
        this.updateLocalState(sensor);
        this.#httpService.put(`readings/${newSensor.id}`, newSensor).subscribe({
          error: () => {
            if(!oldSensor) return;
            this.updateLocalState(oldSensor);
            this.#dialogService.openDialogSuccess({type: 'error', text: `Ha ocurrido un error al intentar actualizar el sensor de ${newSensor.name}`});
          },
        });
      });
    }
  }

  public updateLocalState(sensor:IReading): void {

    if (!this.#store.selectedPlant().plant || !sensor) return;

    const plant = this.#store.selectedPlant().plant;
    const table = this.#store.table();

    if (!plant) return;

    //  Actualizamos los sensores dentro de la planta seleccionada
    const updatedSensors = plant.sensors.map((s) => (s.id === sensor.id ? sensor : s));

    //  Generamos la planta con los sensores y cálculos actualizados
    const updatedPlant: IPlant = {
        ...plant,
        sensors: updatedSensors,
        readingsOk: updatedSensors.reduce((acc, s) => acc + s.readingsOk, 0),
        mediumAlerts: updatedSensors.reduce((acc, s) => acc + s.mediumAlerts, 0),
        redAlerts: updatedSensors.reduce((acc, s) => acc + s.redAlerts, 0),
        disabledSensors: updatedSensors.filter((s) => s.disabled).length,
    };

    //  Actualizamos la tabla con la planta actualizada
    const updatedTable = table.map((p) =>
        p.id === updatedPlant.id ? updatedPlant : p
    );

    //  Actualizamos los totales globales en el dashboard
    const updatedGlobal: IGlobal = {
        totalReadingsOk: updatedTable.reduce((acc, p) => acc + p.readingsOk, 0),
        totalMediumAlerts: updatedTable.reduce((acc, p) => acc + p.mediumAlerts, 0),
        totalRedAlerts: updatedTable.reduce((acc, p) => acc + p.redAlerts, 0),
        totalDisabledSensors: updatedTable.reduce((acc, p) => acc + p.disabledSensors, 0),
    };

    //  Generamos el nuevo estado del store
    const actualState = this.#store.state();
    const newState = {
        ...actualState,
        dashboard: {
            ...actualState.dashboard,
            global: updatedGlobal,  // Actualizamos los totales
            table: {
                ...actualState.dashboard.table,
                plants: updatedTable, // Actualizamos la lista de plantas
            },
            selected: {
                ...actualState.dashboard.selected,
                plant: { ...actualState.dashboard.selected.plant, plant: updatedPlant },
                sensor: { ...actualState.dashboard.selected.sensor, sensor: sensor },
            },
        },
    };

    //  Guardamos el nuevo estado en el store
    this.#store.setState(newState);
  }




  // Función para comparar si los sensores son iguales
  private areSensorsEqual(sensor1: IReading, sensor2: IReading): boolean {
    return sensor1.id === sensor2.id && sensor1.name === sensor2.name && sensor1.readingsOk === sensor2.readingsOk && sensor1.mediumAlerts === sensor2.mediumAlerts && sensor1.redAlerts === sensor2.redAlerts;
  }


  public onDisable(): void {

    // Cerrar el diálogo actual antes de abrir el de confirmación
    this.#thisDialog.close();


    // Pedir confirmación antes de deshabilitar el sensor
    const confirmDialog = this.#dialogService.openDialogConfirm({
        title: 'Confirmación',
        message: `¿Está seguro de que desea cambiar el estado del sensor de ${this.data.name ?? 'sensor'}?`,
        legendButtonConfirm: 'Confirmar'
    });

    confirmDialog.afterClosed().subscribe((result: boolean) => {
      if (!result) {
          return;
      }

      this.#store.updateSelectedSensor(this.data);
      this.#store.setSensorStatus('LOADING');

      this.#httpService.put(`readings/${this.data.id}/change-state`, this.data.id)
        .subscribe({
          next: () => {
            this.updateLocalDisabledState(this.data.id);
            this.#store.setSensorStatus('LOADED');

            // Mostrar diálogo de éxito
            this.#dialogService.openDialogSuccess({
                type: 'success',
                text: `Sensor ${this.data.name} ${this.data.disabled ? 'deshabilitado' : 'habilitado'} correctamente.`
            });
          },
          error: () => {
            this.#store.setSensorStatus('ERROR');

            // Mostrar diálogo de error
            this.#dialogService.openDialogSuccess({
                type: 'error',
                text: `Error al intentar actualizar el sensor de ${this.data.name}.`
            });
          },
        }
        );
    });
  }


  public updateLocalDisabledState(sensorId: number): void {

    if (!this.#store.selectedPlant().plant) return;

    const plant = this.#store.selectedPlant().plant;
    const table = this.#store.table();

    if (!plant) return;

    //  Cambiamos el estado `disabled` del sensor seleccionado
    const updatedSensors = plant.sensors.map((s) =>
        s.id === sensorId ? { ...s, disabled: !s.disabled } : s
    );

    //  Generamos la planta con los sensores actualizados
    const updatedPlant: IPlant = {
      ...plant,
      sensors: updatedSensors,
        readingsOk: updatedSensors.reduce((acc, s) => acc + s.readingsOk, 0),
        mediumAlerts: updatedSensors.reduce((acc, s) => acc + s.mediumAlerts, 0),
        redAlerts: updatedSensors.reduce((acc, s) => acc + s.redAlerts, 0),
        disabledSensors: updatedSensors.filter((s) => s.disabled).length,
    };

    //  Actualizamos la tabla con la planta actualizada
    const updatedTable = table.map((p) =>
        p.id === updatedPlant.id ? updatedPlant : p
    );

    //  Recalculamos los totales en el dashboard
    const updatedGlobal: IGlobal = {
        totalReadingsOk: updatedTable.reduce((acc, p) => acc + p.readingsOk, 0),
        totalMediumAlerts: updatedTable.reduce((acc, p) => acc + p.mediumAlerts, 0),
        totalRedAlerts: updatedTable.reduce((acc, p) => acc + p.redAlerts, 0),
        totalDisabledSensors: updatedTable.reduce((acc, p) => acc + p.disabledSensors, 0),
    };

    //  Generamos el nuevo estado del store
    const actualState = this.#store.state();
    const newState = {
      ...actualState,
      dashboard: {
        ...actualState.dashboard,
        global: updatedGlobal, // Actualizamos los totales
        table: {
            ...actualState.dashboard.table,
            plants: updatedTable, // Actualizamos la lista de plantas
        },
        selected: {
            ...actualState.dashboard.selected,
            plant: { ...actualState.dashboard.selected.plant, plant: updatedPlant },
        },
      },
    };

    //  Guardamos el nuevo estado en el store
    this.#store.setState(newState);
  }
}
