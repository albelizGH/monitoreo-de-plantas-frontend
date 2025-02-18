/* eslint-disable @typescript-eslint/member-ordering */
import type { Signal } from '@angular/core';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';

import { MatDivider } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';
import { UiIconComponent } from '../../../../../../../ui/icon/icon';
import { TableService } from '../service';
import type { IDashboard } from '../../../../../store/interfaces/store.interface';
import { StoreService } from '../../../../../store/service/store.service';
import { MatIcon } from '@angular/material/icon';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDivider,UiIconComponent,MatMenuModule,MatIcon],
  selector: 'app-private-dashboard-table-tablet',
  templateUrl: './component.html',
  styleUrl: '../component.scss',
})
export class TableTabletComponent{
  public readonly tableService: TableService = inject(TableService);
  readonly #store: StoreService = inject(StoreService);
  public readonly data: Signal<IDashboard> = this.#store.dashboard;
}
