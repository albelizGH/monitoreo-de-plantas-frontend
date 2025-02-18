import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-public-not-found-page',
  templateUrl: './component.html',
  styleUrl: './component.scss',
})
export class PublicNotFoundPage {}
