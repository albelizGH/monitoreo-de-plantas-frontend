/* eslint-disable @typescript-eslint/member-ordering */
import { Injectable, signal, computed } from "@angular/core";
import { EXAMPLE, INITIAL } from "../constants/states";
import type { IStore, IPlant, IReading, IUser, IPlantSelected, ISensorSelected } from "../interfaces/store.interface";
import type { TStatus } from "../types/status";

@Injectable({
  providedIn: 'root'
})
export class StoreService {

  readonly #state = signal<IStore>(EXAMPLE);

  public get store(){
    return this.#state;
  };

  /* GETTERS */

  /** Retorna el estado completo del store */
  public readonly state = computed<IStore>(() => this.#state());

  /** Retorna la información del dashboard */
  public readonly dashboard = computed<IStore['dashboard']>(() => this.#state().dashboard);

  /** Retorna la información de la tabla */
  public readonly table = computed<IStore['dashboard']['table']['plants']>(() => this.#state().dashboard.table.plants);

  /** Retorna la información del usuario */
  public readonly user = computed<IStore['user']>(() => this.#state().user);

  /** Retorna la planta seleccionada en el dashboard */
  public readonly selectedPlant = computed<IPlantSelected>(() => this.#state().dashboard.selected.plant);

  /** Retorna el sensor seleccionado en el dashboard */
  public readonly selectedSensor = computed<ISensorSelected>(() => this.#state().dashboard.selected.sensor);

  /* SETTERS */

  /**
   * Reemplaza completamente el estado del store.
   * @param newState - Nuevo estado completo
   */
  public setState(newState: IStore): void {
    this.#state.set(newState);
  }

  /**
   * Actualiza parcialmente el estado con los valores proporcionados.
   * @param partial - Valores parciales a actualizar en el estado
   */
  public updateState(partial: Partial<IStore>): void {
    this.#state.update(state => ({ ...state, ...partial }));
  }

  /**
   * Actualiza la información del usuario.
   * @param user - Información parcial del usuario
   * @param status - Estado opcional, por defecto 'LOADED'
   */
  public updateUser(user: Partial<IUser>, status: TStatus = 'LOADED'): void {
    this.#state.update(state => ({
      ...state,
      user: { ...state.user, ...user, status }
    }));
  }

  /**
   * Actualiza la lista de plantas en el dashboard.
   * @param plants - Lista de plantas
   * @param status - Estado opcional, por defecto 'LOADED'
   */
  public setTable(plants: IPlant[], status: TStatus = 'LOADED'): void {
    this.#state.update(state => ({
      ...state,
      dashboard: {
        ...state.dashboard,
        table: { ...state.dashboard.table, plants, status }
      }
    }));
  }

  /**
   * Establece la planta seleccionada en el dashboard.
   * @param plant - Planta a seleccionar o `null`
   */
  public updateSelectedPlant(plant: IPlant | null, status: TStatus = 'LOADED'): void {
    this.#state.update(state => ({
      ...state,
      dashboard: {
        ...state.dashboard,
        selected: {
          ...state.dashboard.selected,
          plant: { plant, status }
        }
      }
    }));
  }

  /**
   * Establece el sensor seleccionado en el dashboard.
   * @param sensor - Sensor a seleccionar o `null`
   */
  public updateSelectedSensor(sensor: IReading | null, status: TStatus = 'LOADED'): void {
    this.#state.update(state => ({
      ...state,
      dashboard: {
        ...state.dashboard,
        selected: {
          ...state.dashboard.selected,
          sensor: { sensor, status }
        }
      }
    }));
  }

  /**
   * Actualiza el estado del dashboard.
   * @param status - Nuevo estado
   */
  public setDashboardStatus(status: TStatus): void {
    this.#state.update(state => ({
      ...state,
      dashboard: { ...state.dashboard, status }
    }));
  }

  /**
   * Actualiza el estado de la tabla de plantas.
   * @param status - Nuevo estado
   */
  public setTableStatus(status: TStatus): void {
    this.#state.update(state => ({
      ...state,
      dashboard: {
        ...state.dashboard,
        table: { ...state.dashboard.table, status }
      }
    }));
  }

  /**
   * Actualiza el estado del usuario.
   * @param status - Nuevo estado
   */
  public setUserStatus(status: TStatus): void {
    this.#state.update(state => ({
      ...state,
      user: { ...state.user, status }
    }));
  }

   /**
   * Actualiza el estado de la planta seleccionada.
   * @param status - Nuevo estado
   */
   public setPlantStatus(status: TStatus): void {
    this.#state.update(state => ({
      ...state,
      dashboard: {
        ...state.dashboard,
        selected: {
          ...state.dashboard.selected,
          plant: { ...state.dashboard.selected.plant, status }
        }
      }
    }));
  }

  /**
   * Actualiza el estado del sensor seleccionado.
   * @param status - Nuevo estado
   */
  public setSensorStatus(status: TStatus): void {
    this.#state.update(state => ({
      ...state,
      dashboard: {
        ...state.dashboard,
        selected: {
          ...state.dashboard.selected,
          sensor: { ...state.dashboard.selected.sensor, status }
        }
      }
    }));

  }

  /**
 * Actualiza el estado general de la aplicación.
 * @param status - Nuevo estado
 */
public setAppStatus(status: TStatus): void {
  this.#state.update(state => ({
    ...state,
    status
  }));
}

}
