import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { CompetitionComponent } from '../list/competition.component';
import { CompetitionDetailComponent } from '../detail/competition-detail.component';
import { CompetitionUpdateComponent } from '../update/competition-update.component';
import { CompetitionRoutingResolveService } from './competition-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const competitionRoute: Routes = [
  {
    path: '',
    component: CompetitionComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: CompetitionDetailComponent,
    resolve: {
      competition: CompetitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: CompetitionUpdateComponent,
    resolve: {
      competition: CompetitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: CompetitionUpdateComponent,
    resolve: {
      competition: CompetitionRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(competitionRoute)],
  exports: [RouterModule],
})
export class CompetitionRoutingModule {}
