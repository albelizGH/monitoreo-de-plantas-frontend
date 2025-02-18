/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/class-methods-use-this */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/member-ordering */
import type { OnInit, Signal } from '@angular/core';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { StoreService } from '../../../../../store/service/store.service';
import { DetailCardComponent } from '../card/component';
import type { IDashboard, IReading } from '../../../../../store/interfaces/store.interface';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'app-private-dashboard-sensors-container',
  imports: [DetailCardComponent,MatProgressSpinnerModule],
  templateUrl: './component.html',
  styleUrl: './component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SensorsContainer {
  readonly #store: StoreService = inject(StoreService);
  readonly #dialogService: DialogService = inject(DialogService);
  public data = this.#store.dashboard;
  public selectedPlant = this.#store.selectedPlant;

  public readonly sensors:Signal<IReading[]> = computed(() => {
     const selectedPlant = this.#store.dashboard().selected.plant.plant;
     return selectedPlant?.sensors ?? [];
  });
  

  public edit(reading: IReading): void {
    this.#store.updateSelectedSensor(reading);
    const dialog = this.#dialogService.openDialogEditSensor(reading);
  }
  

}





   