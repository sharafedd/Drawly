import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PromptComponent } from '../list/prompt.component';
import { PromptDetailComponent } from '../detail/prompt-detail.component';
import { PromptUpdateComponent } from '../update/prompt-update.component';
import { PromptRoutingResolveService } from './prompt-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const promptRoute: Routes = [
  {
    path: '',
    component: PromptComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PromptDetailComponent,
    resolve: {
      prompt: PromptRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PromptUpdateComponent,
    resolve: {
      prompt: PromptRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PromptUpdateComponent,
    resolve: {
      prompt: PromptRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(promptRoute)],
  exports: [RouterModule],
})
export class PromptRoutingModule {}
