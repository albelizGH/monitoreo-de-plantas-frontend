import { ChangeDetectionStrategy, Component, input, Output, EventEmitter } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import type { TIcon, TMode, TSize} from "../icon/icon";
import { UiIconComponent } from "../icon/icon";

type TButton = 'mat-button' | 'mat-raised-button'| 'mat-stroked-button'| 'mat-icon-button';

@Component({
  selector: 'ui-button',
  imports: [MatButtonModule, UiIconComponent],
  templateUrl: './component.html',
  styleUrl: './component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Output() public readonly buttonClick = new EventEmitter<void>();
  public readonly typeOfButton = input<TButton>('mat-button');
  public readonly legend = input<string>('');
  public readonly icon = input<TIcon>('check');
  public readonly iconSize = input<TSize>('24px');
  public readonly mode = input<TMode>();

    public onClick(): void {
        this.buttonClick.emit();
    }
}
