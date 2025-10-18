import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CompetitionPromptComponent } from '../list/competition-prompt.component';
import { CompetitionPromptDetailComponent } from '../detail/competition-prompt-detail.component';
import { CompetitionPromptUpdateComponent } from '../update/competition-prompt-update.component';
import { CompetitionPromptRoutingResolveService } from './competition-prompt-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const competitionPromptRoute: Routes = [
  {
    path: '',
    component: CompetitionPromptComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CompetitionPromptDetailComponent,
    resolve: {
      competitionPrompt: CompetitionPromptRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CompetitionPromptUpdateComponent,
    resolve: {
      competitionPrompt: CompetitionPromptRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CompetitionPromptUpdateComponent,
    resolve: {
      competitionPrompt: CompetitionPromptRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(competitionPromptRoute)],
  exports: [RouterModule],
})
export class CompetitionPromptRoutingModule {}
