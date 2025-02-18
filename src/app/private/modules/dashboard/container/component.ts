/* eslint-disable @typescript-eslint/no-magic-numbers */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { DeviceInformationService } from '../../../../core/services/deviceInformation.service';
import { PrivateService } from '../../../services/private.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogService } from '../services/dialog.service';
import { StoreService } from '../../../store/service/store.service';
import { GlobalContainer } from "../components/global/container/component";
import { TableMobileComponent } from "../components/table/mobile/component";
import { TableTabletComponent } from "../components/table/tablet/component";
import { TableComponent } from "../components/table/component";
import { SensorsContainer } from "../components/sensors/container/component";

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatProgressSpinnerModule, GlobalContainer, TableMobileComponent, TableTabletComponent, TableComponent, SensorsContainer],
  selector: 'app-private-dashboard-container',
  templateUrl: './component.html',
  styleUrl: './component.scss',
})
export class PrivateDashboardContainer implements OnInit {
  //Inyeccion de los servicios privados para obtener el estado inicial de la aplicacion
  readonly #privateService: PrivateService = inject(PrivateService);
  //Inyeccion de los servicios del dialog para abrir los dialogos
  public readonly dialogService: DialogService = inject(DialogService);
  //Inyeccion de los servicios del dispositivo para saber si es mobile
  public deviceService = inject(DeviceInformationService);

  // Inyeccion del store
  readonly #store: StoreService = inject(StoreService);
  public readonly state = this.#store.state;

  public ngOnInit(): void {
 this.#store.setDashboardStatus('LOADING');
 this.#privateService.getInitialState().subscribe({
   next: (state) => {
     // Actualiza el usuario
     this.#store.updateUser(state.user)
     // Actualiza la tabla
     this.#store.setTable(state.table)
     // Actualiza el estado de dashboard, evitando la mutación directa
     const updatedState = this.#store.state();
     this.#store.setState({
       ...updatedState,
       dashboard: {
         ...updatedState.dashboard,
         status: 'LOADED',
         global: {
           totalReadingsOk: state.global.totalReadingsOk,
           totalMediumAlerts: state.global.totalMediumAlerts,
           totalRedAlerts: state.global.totalRedAlerts,
           totalDisabledSensors: state.global.totalDisabledSensors,
         },
       },
     })
   },
   error: (error) => {
     console.error('Error al traer datos', error);
   },
 });
}

}