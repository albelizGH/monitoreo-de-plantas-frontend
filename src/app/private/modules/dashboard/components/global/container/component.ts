import type { Signal } from '@angular/core';
import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { GlobalCardComponent } from '../card/component';
import { StoreService } from '../../../../../store/service/store.service';

@Component({
  selector: 'app-dashboard-global-container',
  imports: [GlobalCardComponent],
  templateUrl: './component.html',
  styleUrl: './component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GlobalContainer { 

  public readonly storeService: StoreService = inject(StoreService);
  public data = this.storeService.dashboard;
 
}

