import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import type { TIcon, TMode} from '../../../../../../../ui/icon/icon';
import { UiIconComponent } from '../../../../../../../ui/icon/icon';


@Component({
  selector: 'app-global-card',
  imports: [UiIconComponent],
  templateUrl: './component.html',
  styleUrl: './component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalCardComponent implements OnInit { 
    public readonly type = input<string>();
    public title ='';
    public icon:TIcon = 'check';
    public readonly quantity = input<number>();
    public mode : TMode = 'lecturas';

  public ngOnInit(): void {
    switch (this.type()) {
      case 'lecturas':
        this.title = 'Lecturas OK';
        this.icon = 'check';
        this.mode = 'lecturas';
        break;

      case 'alertas-medias':
        this.title = 'Alertas medias';
        this.icon = 'priority_high';
        this.mode = 'alertas-medias';
        break;

      case 'alertas-rojas':
        this.title = 'Alertas rojas';
        this.icon = 'warning';
        this.mode = 'alertas-rojas';
        break;

      case 'sensores':
        this.title = 'Sensores deshabilitados';
        this.icon = 'close';
        this.mode = 'sensores';
        break;

      default:
        this.title = 'Lecturas OK';
        this.icon = 'check';
        this.mode = 'lecturas';
        break;
    }
  }
}


