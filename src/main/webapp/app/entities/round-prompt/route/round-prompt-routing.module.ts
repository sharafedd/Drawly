import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RoundPromptComponent } from '../list/round-prompt.component';
import { RoundPromptDetailComponent } from '../detail/round-prompt-detail.component';
import { RoundPromptUpdateComponent } from '../update/round-prompt-update.component';
import { RoundPromptRoutingResolveService } from './round-prompt-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const roundPromptRoute: Routes = [
  {
    path: '',
    component: RoundPromptComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RoundPromptDetailComponent,
    resolve: {
      roundPrompt: RoundPromptRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RoundPromptUpdateComponent,
    resolve: {
      roundPrompt: RoundPromptRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RoundPromptUpdateComponent,
    resolve: {
      roundPrompt: RoundPromptRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(roundPromptRoute)],
  exports: [RouterModule],
})
export class RoundPromptRoutingModule {}
