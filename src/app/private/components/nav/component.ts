import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { LinkComponent } from "../../../../ui/link/component";
import { MatDivider } from '@angular/material/divider';
import { ButtonComponent } from "../../../../ui/button/component";
import { AuthService } from '../../../core/services/auth.service';
import { MatIcon } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-nav',
  imports: [LinkComponent, MatDivider, MatIcon,MatTooltipModule,MatButtonModule],
  templateUrl: './component.html',
  styleUrl: './component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavComponent {
    public readonly isMobile = input<boolean>(false);
    public readonly authservice = inject(AuthService);
}
