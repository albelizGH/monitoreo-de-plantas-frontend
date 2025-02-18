import { ChangeDetectionStrategy, Component, inject, Inject, input } from '@angular/core';
import {MatButtonModule} from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule} from '@angular/material/dialog';
import { ButtonComponent } from "../../../../../../../ui/button/component";

export interface IConfirmDialogData {
    title: string,
    message: string,
    legendButtonConfirm:string
}

@Component({
  selector: 'app-confirm-dialog',
  imports: [MatDialogModule, MatButtonModule, ButtonComponent],
  templateUrl: './component.html',
  styleUrl: './component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmDialog {
    public data = inject<IConfirmDialogData>(MAT_DIALOG_DATA);

}