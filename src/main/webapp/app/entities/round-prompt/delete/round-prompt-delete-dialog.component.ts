import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IRoundPrompt } from '../round-prompt.model';
import { RoundPromptService } from '../service/round-prompt.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './round-prompt-delete-dialog.component.html',
})
export class RoundPromptDeleteDialogComponent {
  roundPrompt?: IRoundPrompt;

  constructor(protected roundPromptService: RoundPromptService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.roundPromptService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
