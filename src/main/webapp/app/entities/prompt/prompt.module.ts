import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { PromptComponent } from './list/prompt.component';
import { PromptDetailComponent } from './detail/prompt-detail.component';
import { PromptUpdateComponent } from './update/prompt-update.component';
import { PromptDeleteDialogComponent } from './delete/prompt-delete-dialog.component';
import { PromptRoutingModule } from './route/prompt-routing.module';

@NgModule({
  imports: [SharedModule, PromptRoutingModule],
  declarations: [PromptComponent, PromptDetailComponent, PromptUpdateComponent, PromptDeleteDialogComponent],
})
export class PromptModule {}
