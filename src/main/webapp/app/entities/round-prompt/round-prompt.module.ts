import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RoundPromptComponent } from './list/round-prompt.component';
import { RoundPromptDetailComponent } from './detail/round-prompt-detail.component';
import { RoundPromptUpdateComponent } from './update/round-prompt-update.component';
import { RoundPromptDeleteDialogComponent } from './delete/round-prompt-delete-dialog.component';
import { RoundPromptRoutingModule } from './route/round-prompt-routing.module';

@NgModule({
  imports: [SharedModule, RoundPromptRoutingModule],
  declarations: [RoundPromptComponent, RoundPromptDetailComponent, RoundPromptUpdateComponent, RoundPromptDeleteDialogComponent],
})
export class RoundPromptModule {}
