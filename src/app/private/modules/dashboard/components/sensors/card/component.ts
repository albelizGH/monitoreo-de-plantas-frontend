import type { OnInit} from '@angular/core';
import { ChangeDetectionStrategy, Component, EventEmitter, input, Output } from '@angular/core';
import type { TIcon} from '../../../../../../../ui/icon/icon';
import { UiIconComponent } from '../../../../../../../ui/icon/icon';
import { ButtonComponent } from '../../../../../../../ui/_index';
import type { IReading } from '../../../../../store/interfaces/store.interface';

export type TDetailCard = 'Temperature' | 'Presión' | 'Viento' | 'Niveles' | 'Energía' | 'Tensión' | 'Monóxido de Carbono' | 'Otros gases';

@Component({
  selector: 'app-detail-card',
  imports: [UiIconComponent, ButtonComponent],
  templateUrl: './component.html',
  styleUrl: './component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailCardComponent implements OnInit {
 
  @Output() public readonly edit:EventEmitter<IReading> = new EventEmitter<IReading>();
  public readonly data = input.required<IReading>();
  public icon:TIcon='device_thermostat';

  public ngOnInit(): void {
    switch (this.data.name) {
        case 'Temperatura':
            this.icon = 'device_thermostat';
            break;
        case 'Presión':
            this.icon = 'speed';
            break;
        case 'Viento':
            this.icon = 'air';
            break;
        case 'Niveles':
            this.icon = 'waves'; 
            break;
        case 'Energía':
            this.icon = 'eco';
            break;
        case 'Tensión':
            this.icon = 'offline_bolt';
            break;
        case 'Monóxido de Carbono':
            this.icon = 'co2';
            break;
        case 'Otros gases':
            this.icon = 'cloud';
            break;
        }
    }

  public editSensor(): void {
    this.edit.emit(this.data());
  }
}
