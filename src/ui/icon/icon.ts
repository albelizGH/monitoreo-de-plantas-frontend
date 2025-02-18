import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

export type TIcon = 'home' | 'check' | 'priority_high' | 'warning' | 'close' | 'check_circle' | 'error' | 'device_thermostat' | 'speed' | 'air' | 'eco' | 'offline_bolt' | 'co2' | 'cloud' | 'waves' | 'edit' | 'sensors_off' | 'sensors' | 'logout';
export type TMode = 'lecturas' | 'alertas-medias' | 'alertas-rojas' | 'sensores' | 'default';
export type TSize = '12px' | '14px' | '16px' | '24px';
type TScale = '0.75' | '1' | '1.25' | '1.5' | '2' | '2.5' | '4';

@Component({
  selector: 'ui-icon',
  imports: [MatIcon],
  templateUrl: './icon.html',
  styleUrl: './icon.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UiIconComponent {
  // public readonly type = input<string>();
  // public readonly icon = input<string>('home');
  // public readonly size = input<string>('24px');

  public readonly icon = input.required<TIcon>();
  public readonly mode = input<TMode>();
  public readonly size = input<TSize>('24px');
  public readonly scale = input<TScale>('1');
}

// @switch (type()) { @case ('lecturas') {
//   <div class="circle lecturas"><mat-icon style="font-size: {{size()}};">check</mat-icon></div>
//   }@case ('alertas-medias') {
//   <div class="circle alertas-medias"><mat-icon style="font-size: {{size()}};">priority_high</mat-icon></div>
//   }@case ('alertas-rojas') {
//   <div class="circle alertas-rojas"><mat-icon style="font-size: {{size()}};">warning</mat-icon></div>
//   }@case ('sensores') {
//   <div class="circle sensores"><mat-icon style="font-size: {{size()}};">close</mat-icon></div>
//   }@case ('normal') {
//   <div><mat-icon style="font-size: {{size()}};">{{icon()}}</mat-icon></div>
//   }@default {
//   <div class="circle default"><mat-icon style="font-size: {{size()}}">{{icon()}}</mat-icon></div>
//   } }
