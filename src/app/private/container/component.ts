import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from '@angular/material/sidenav';
// eslint-disable-next-line @typescript-eslint/consistent-type-imports
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NavComponent } from "../components/nav/component";
import {MatBadgeModule} from '@angular/material/badge';
import { DeviceInformationService } from '../../core/services/deviceInformation.service';
import { StoreService } from '../store/service/store.service';



@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RouterOutlet, MatDrawerContainer, MatDrawer, MatDrawerContent, MatIconModule, MatButtonModule, NavComponent,MatBadgeModule],
  selector: 'app-private-container',
  templateUrl: './component.html',
  styleUrl: './component.scss',
})
export class PrivateContainer{
  
  readonly #storeService = inject(StoreService);
  public deviceInformationService = inject(DeviceInformationService);
  public isMobile = this.deviceInformationService.isMobile()
  public readonly data = this.#storeService.user;

}
