import type { IStore } from "../interfaces/store.interface"

export const INITIAL:IStore = {
  status: 'INITIAL',
  dashboard: {
    status: 'INITIAL',
    global: { totalReadingsOk: 0, totalMediumAlerts: 0, totalRedAlerts: 0, totalDisabledSensors: 0 },
    selected: { sensor:{ status: 'INITIAL', sensor: null }, plant: { status: 'INITIAL', plant: null } },
    table: { status: 'INITIAL', plants: [] }
  },
  user: {
    status: 'INITIAL',
    username: '',
    email: ''
  }
}

export const EXAMPLE: IStore = {
  status: 'INITIAL',
  dashboard: {
    status: 'LOADED',
    global: { 
      totalReadingsOk: 20, 
      totalMediumAlerts: 20, 
      totalRedAlerts: 5, 
      totalDisabledSensors: 3 
    },
    selected: { sensor:{ status: 'INITIAL', sensor: null }, plant: { status: 'INITIAL', plant: null } },
    table: { 
      status: 'LOADED', 
      plants: [
        { 
          id: 1, 
          name: 'Planta Sur', 
          country: { name: 'Chile', imageUrl: 'path/to/chile-flag.png' },
          sensors: [
            { id: 201, name: 'Sensor de humedad', readingsOk: 20, mediumAlerts: 5, redAlerts: 1, disabled: false }
          ], 
          readingsOk: 21, 
          mediumAlerts: 5, 
          redAlerts: 1, 
          disabledSensors: 0 
        },
        { 
          id: 2, 
          name: 'Planta Este', 
          country: { name: 'Brasil', imageUrl: 'path/to/brazil-flag.png' },
          sensors: [
            { id: 202, name: 'Sensor de presión', readingsOk: 40, mediumAlerts: 2, redAlerts: 3, disabled: false }
          ], 
          readingsOk: 40, 
          mediumAlerts: 2, 
          redAlerts: 3, 
          disabledSensors: 0 
        },
        { 
          id: 3, 
          name: 'Planta Oeste', 
          country: { name: 'Perú', imageUrl: 'path/to/peru-flag.png' },
          sensors: [
            { id: 203, name: 'Sensor de flujo', readingsOk: 30, mediumAlerts: 0, redAlerts: 0, disabled: true }
          ], 
          readingsOk: 30, 
          mediumAlerts: 0, 
          redAlerts: 0, 
          disabledSensors: 1 
        }
      ]
    }
  },
  user: {
    status: 'LOADED',
    username: 'belizalejo',
    email: 'beliz.alejo@example.com'
  }
};
