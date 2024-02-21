import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { CompetitionComponent } from './list/competition.component';
import { CompetitionDetailComponent } from './detail/competition-detail.component';
import { CompetitionUpdateComponent } from './update/competition-update.component';
import { CompetitionDeleteDialogComponent } from './delete/competition-delete-dialog.component';
import { CompetitionRoutingModule } from './route/competition-routing.module';

@NgModule({
  imports: [SharedModule, CompetitionRoutingModule],
  declarations: [CompetitionComponent, CompetitionDetailComponent, CompetitionUpdateComponent, CompetitionDeleteDialogComponent],
})
export class CompetitionModule {}
