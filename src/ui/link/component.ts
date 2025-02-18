import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, Input, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import type { TooltipPosition } from '@angular/material/tooltip';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormControl } from '@angular/forms';

type TLink = 'link-icon' | 'link-text' | 'link-icon-text';

@Component({
  selector: 'ui-link',
  imports: [MatIconModule, MatTooltipModule],
  templateUrl: './component.html',
  styleUrl: './component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LinkComponent implements OnInit {
  public readonly type = input.required<TLink>();
  public readonly legend = input<string>('');
  public readonly icon = input<string>('');
  public readonly link = input<string>('');
  public readonly text = input<string>('');
  public readonly size = input<string>('24px');

  @Input() toolTipPosition = 0;

//Para los tooltips
public positionOptions: TooltipPosition[] = ['below', 'above', 'left', 'right'];
public position!: FormControl;

public ngOnInit(): void {
  this.position = new FormControl(this.positionOptions[this.toolTipPosition]);
}
}
