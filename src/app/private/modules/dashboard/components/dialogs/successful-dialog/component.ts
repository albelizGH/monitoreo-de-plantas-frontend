import { ChangeDetectionStrategy, Component, inject, Inject } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { ButtonComponent } from '../../../../../../../ui/button/component';
import { UiIconComponent } from "../../../../../../../ui/icon/icon";

export interface ISuccessfulDialogData {
    type: 'success' | 'error',
    text: string
}

@Component({
  selector: 'app-successful-dialog',
  imports: [MatDialogModule, MatButtonModule, ButtonComponent, UiIconComponent],
  templateUrl: './component.html',
  styleUrl: './component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SuccessfulDialog {
  public data = inject<ISuccessfulDialogData>(MAT_DIALOG_DATA);
}