import { TStatus } from "../types/status";

export interface IStore {
  /** Usado para cargar pantallas de carga en general que ocupan toda la pantalla */
  status: TStatus;
  
  /** Información relacionada al dashboard de la aplicación */
  dashboard: IDashboard;  

  /** Información del usuario actual (nombre, email, etc.) */
  user: IUser;  
}

export interface IDashboard {
  /** Estado del dashboard (cargando, error, etc.) */
  status: TStatus;  

  /** Guarda los datos globales, como el total de lecturas, alertas, etc */
  global: IGlobal;  

  /** Guarda los datos seleccionados en el dashboard */
  selected: IDashboardSelected;  

  /** Guarda las plantas */
  table: ITable;  
}

export interface IGlobal {
  /** Total de lecturas exitosas */
  totalReadingsOk: number;  

  /** Total de alertas medias */
  totalMediumAlerts: number;  

  /** Total de alertas rojas */
  totalRedAlerts: number;  

  /** Total de sensores deshabilitados */
  totalDisabledSensors: number;  
}

export interface ITable {
  /** Estado de la tabla de plantas (cargando, error, etc.) */
  status: TStatus;  

  /** Lista de plantas (cada planta contiene su propia información) */
  plants: IPlant[];  
}

export interface IDashboardSelected {
  /** Información sobre el sensor seleccionado */
  sensor: ISensorSelected;  

  /** Información sobre la planta seleccionada */
  plant: IPlantSelected;  
}

export interface ISensorSelected {
  /** Estado del sensor (cargando, error, etc.) */
  status: TStatus;  

  /** Sensor seleccionado o null si no hay uno seleccionado */
  sensor: IReading | null;  
}

export interface IPlantSelected {
  /** Estado de la planta (cargando, error, etc.) */
  status: TStatus;  

  /** Planta seleccionada o null si no hay una seleccionada */
  plant: IPlant | null;  
}

export interface IUser {
  /** Estado del usuario (cargando, error, etc.) */
  status: TStatus;  

  /** Nombre de usuario */
  username: string;  

  /** Correo electrónico del usuario */
  email: string;  
}

export interface IPlant {
  /** Identificador único de la planta */
  id: number;  

  /** Nombre de la planta */
  name: string;  

  /** País de la planta (información sobre el país) */
  country: ICountry;  

  /** Lista de sensores asociados a la planta */
  sensors: IReading[];  

  /** Número de lecturas exitosas de la planta */
  readingsOk: number;  

  /** Número de alertas medias asociadas a la planta */
  mediumAlerts: number;  

  /** Número de alertas rojas asociadas a la planta */
  redAlerts: number;  

  /** Número de sensores deshabilitados en la planta */
  disabledSensors: number;  
}

export interface ICountry {
  /** Nombre del país */
  name: string;  

  /** URL de la imagen representativa del país */
  imageUrl: string;  
}

export interface IReading {
  /** Identificador único de la lectura */
  id: number;  

  /** Nombre de la lectura (ejemplo: tipo de sensor) */
  name: string;  

  /** Número de lecturas exitosas */
  readingsOk: number;  

  /** Número de alertas medias asociadas a esta lectura */
  mediumAlerts: number;  

  /** Número de alertas rojas asociadas a esta lectura */
  redAlerts: number;  

  /** Indica si el sensor está deshabilitado o no */
  disabled: boolean;  
}
