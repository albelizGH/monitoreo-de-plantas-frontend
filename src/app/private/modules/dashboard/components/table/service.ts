/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/class-methods-use-this */
import { inject, Injectable } from "@angular/core";
import type { ICountry, IGlobal, IPlant, IReading, IStore } from "../../../../store/interfaces/store.interface";
import { StoreService } from "../../../../store/service/store.service";
import { HttpService } from "../../../../../core/services/http.service";
import { DialogService } from "../../services/dialog.service";
import { ICountryApiResponse } from "../../interface/country-api.interface";
import { map, Observable } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable(
  {providedIn: 'root'}
)
export class TableService {

  readonly #storeService: StoreService = inject(StoreService);
  readonly #httpService: HttpService = inject(HttpService);
  readonly #dialogService: DialogService = inject(DialogService);
  readonly #httpClient: HttpClient = inject(HttpClient);

  public showSensors(plant: IPlant): void {    
    if (this.isPlantSelected(plant)) {
      this.deselectPlant();
    } else {
      const plantInTable = this.getPlantFromTable(plant);
      if (plantInTable) {
        if (this.hasNoSensors(plantInTable)) {
          this.loadPlantSensors(plant);
        } else {
          this.selectPlant(plant);
        }
      } else {
        this.loadPlantSensors(plant);
      }
    }
  }

  private isPlantSelected(plant: IPlant): boolean {
    return this.#storeService.selectedPlant().plant === plant;
  }

  private deselectPlant(): void {
    this.#storeService.updateSelectedPlant(null);
  }

  private getPlantFromTable(plant: IPlant): IPlant | undefined {
    return this.#storeService.dashboard().table.plants.find((tablePlant) => tablePlant === plant);
  }

  private hasNoSensors(plant: IPlant): boolean {
    return !Array.isArray(plant.sensors) || plant.sensors.length === 0;
  }

  private loadPlantSensors(plant: IPlant): void {    
    // Seleccionamos la planta y actualizamos el estado a "Cargando"
    this.#storeService.updateSelectedPlant(plant);
    this.#storeService.setPlantStatus('LOADING');
    
    // Realizamos la petición HTTP para obtener las lecturas de la planta seleccionada
    this.#httpService.get<IReading[], undefined>(`plants/${plant.id.toString()}/readings`).subscribe({
      next: (readings) => {
                
        this.updatePlantWithSensors(plant, readings);
        this.updateTableWithSensors(plant, readings);
      },
      error: (error) => {
        console.error('Error al obtener las lecturas', error);
        this.#storeService.setPlantStatus('ERROR');
      }
    });
  }

  private updatePlantWithSensors(plant: IPlant, readings: IReading[]): void {
    this.#storeService.updateSelectedPlant({
      ...plant,
      sensors: readings,
    });
    this.#storeService.setPlantStatus('LOADED');
  }

  private updateTableWithSensors(plant: IPlant, readings: IReading[]): void {
    const newTableData: IPlant[] = this.#storeService.dashboard().table.plants.map((tablePlant) => {
      if (tablePlant === plant) {
        return {
          ...tablePlant,
          sensors: readings,
        };
      }
      return tablePlant;
    });

    this.#storeService.setTable(newTableData);
  }

  private selectPlant(plant: IPlant): void {
    this.#storeService.updateSelectedPlant(plant);
    this.#storeService.setPlantStatus('LOADED');
  }

  create() {
    //Traemos los paises de la api
    this.#storeService.setDashboardStatus('LOADING');
    this.getCountries().subscribe({
      next: (res: ICountry[]) => {
        const sortedCountries = res.sort((a, b) => a.name.localeCompare(b.name));
        this.#storeService.setDashboardStatus('LOADED');
        this.#dialogService.openNewPlantDialog(sortedCountries);
      },
      error: (error) => {
        console.error('Error al obtener los países', error);
      }
    });
    
  }

  edit(plant: IPlant) {
    this.#storeService.setDashboardStatus('LOADING');
    this.getCountries().subscribe({
      next: (res: ICountry[]) => {
        const sortedCountries = res.sort((a, b) => a.name.localeCompare(b.name));
        this.#storeService.setDashboardStatus('LOADED');
        this.#dialogService.openDialogEditPlant(sortedCountries, plant);
      },
      error: (error) => {
        console.error('Error al obtener los países', error);
        this.#storeService.setDashboardStatus('ERROR'); // Opcional: manejar estado de error
      }
    });
}


  delete(plant: IPlant) {

    const dialog = this.#dialogService.openDialogConfirm({
      title: 'Eliminar planta',
      message: `¿Estás seguro
      de que deseas eliminar la planta ${plant.name}?`,
      legendButtonConfirm: 'Eliminar'
    })

    dialog.afterClosed(dialog).subscribe((result: boolean) => {
      if (!result) return;
      this.#storeService.setDashboardStatus('LOADING');
    this.#httpService.delete(`plants/${plant.id.toString()}`).subscribe({
      next: () => {
        this.#storeService.setDashboardStatus('LOADED');
        this.deletePlant(plant.id);
      },
      error: (error) => {
        console.error('Error al eliminar la planta', error);
        this.#storeService.setDashboardStatus('ERROR');
      },
      complete: () => {
        this.#storeService.setDashboardStatus('LOADED');
      }
    });
  }
  );
} 


  private getCountries(): Observable<ICountry[]> {
    const apiUrlPaises = 'https://restcountries.com/v3.1/all?fields=name,flags';
    return this.#httpClient.get<ICountryApiResponse[]>(apiUrlPaises).pipe(
      map((countries: ICountryApiResponse[]) =>
        countries.map((country) => ({
          name: country.name.common,
          imageUrl: country.flags.svg
        }))
      )
    );
}


public deletePlant(plantId: number): void {
  const actualState = this.#storeService.state();
  const table = this.#storeService.table();
  const selectedPlant = this.#storeService.selectedPlant().plant;

  // Filtramos la planta a eliminar del listado de plantas
  const updatedTable = table.filter(plant => plant.id !== plantId);

  // Recalculamos los totales en el dashboard
  const updatedGlobal: IGlobal = {
    totalReadingsOk: updatedTable.reduce((acc, p) => acc + p.readingsOk, 0),
    totalMediumAlerts: updatedTable.reduce((acc, p) => acc + p.mediumAlerts, 0),
    totalRedAlerts: updatedTable.reduce((acc, p) => acc + p.redAlerts, 0),
    totalDisabledSensors: updatedTable.reduce((acc, p) => acc + p.disabledSensors, 0),
  };

  // Si la planta eliminada es la seleccionada la quitamos
  const isDeletingSelectedPlant = selectedPlant?.id === plantId;

  // Generamos el nuevo estado del store
  const newState: IStore = {
      ...actualState,
      dashboard: {
          ...actualState.dashboard,
          global: { ...updatedGlobal }, 
          table: {
              ...actualState.dashboard.table,
              plants: [...updatedTable], 
          },
          selected: {
              ...actualState.dashboard.selected,
              plant: {
                  ...actualState.dashboard.selected.plant,
                  plant: isDeletingSelectedPlant ? null : actualState.dashboard.selected.plant.plant,
              },
          },
      },
  };

  // Guardamos el nuevo estado en el store
  this.#storeService.setState(newState);
}



}