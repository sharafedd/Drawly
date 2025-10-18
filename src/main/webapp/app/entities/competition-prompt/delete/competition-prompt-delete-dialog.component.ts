import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ICompetitionPrompt } from '../competition-prompt.model';
import { CompetitionPromptService } from '../service/competition-prompt.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './competition-prompt-delete-dialog.component.html',
})
export class CompetitionPromptDeleteDialogComponent {
  competitionPrompt?: ICompetitionPrompt;

  constructor(protected competitionPromptService: CompetitionPromptService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.competitionPromptService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
