import type { WritableSignal } from '@angular/core';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceInformationService  {
    public readonly isMobile: WritableSignal<boolean> = signal<boolean>(false);
    public readonly isTablet: WritableSignal<boolean> = signal<boolean>(false);
}
