import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CompetitionPromptComponent } from './list/competition-prompt.component';
import { CompetitionPromptDetailComponent } from './detail/competition-prompt-detail.component';
import { CompetitionPromptUpdateComponent } from './update/competition-prompt-update.component';
import { CompetitionPromptDeleteDialogComponent } from './delete/competition-prompt-delete-dialog.component';
import { CompetitionPromptRoutingModule } from './route/competition-prompt-routing.module';

@NgModule({
  imports: [SharedModule, CompetitionPromptRoutingModule],
  declarations: [
    CompetitionPromptComponent,
    CompetitionPromptDetailComponent,
    CompetitionPromptUpdateComponent,
    CompetitionPromptDeleteDialogComponent,
  ],
})
export class CompetitionPromptModule {}
