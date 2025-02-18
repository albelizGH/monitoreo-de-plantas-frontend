import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import type { OnInit } from '@angular/core';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DeviceInformationService } from './core/services/deviceInformation.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-root',
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class AppComponent implements OnInit{

    public deviceService: DeviceInformationService = inject(DeviceInformationService);
    public isMobile = false;
    public isTablet = false;

   // eslint-disable-next-line @typescript-eslint/parameter-properties
   public constructor(private readonly breakpointObserver: BreakpointObserver) {}

   public ngOnInit(): void {
    this.breakpointObserver.observe([Breakpoints.XSmall])
      .subscribe(result => {
        this.isMobile = result.matches;
        this.deviceService.isMobile.set(result.matches);
      });
  
    this.breakpointObserver.observe([Breakpoints.Small])
      .subscribe(result => {
        this.isTablet = result.matches;
        this.deviceService.isTablet.set(result.matches);
      });
  }
}
