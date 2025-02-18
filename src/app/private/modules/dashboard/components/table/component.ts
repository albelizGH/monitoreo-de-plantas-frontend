/* eslint-disable @typescript-eslint/member-ordering */
import type { Signal } from '@angular/core';
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { StoreService } from '../../../../store/service/store.service';
import type { IDashboard } from '../../../../store/interfaces/store.interface';
import { TableService } from './service';
import { MatDivider } from '@angular/material/divider';
import { UiIconComponent } from '../../../../../../ui/icon/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [MatDivider, UiIconComponent, MatMenuModule, MatButtonModule,MatIcon],
  selector: 'app-private-dashboard-table',
  templateUrl: './component.html',
  styleUrl: './component.scss',
})
export class TableComponent{
  public readonly tableService: TableService = inject(TableService);
  readonly #store: StoreService = inject(StoreService);
  public readonly data: Signal<IDashboard> = this.#store.dashboard;
}
