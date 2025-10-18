import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { RoundComponent } from '../list/round.component';
import { RoundDetailComponent } from '../detail/round-detail.component';
import { RoundUpdateComponent } from '../update/round-update.component';
import { RoundRoutingResolveService } from './round-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const roundRoute: Routes = [
  {
    path: '',
    component: RoundComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: RoundDetailComponent,
    resolve: {
      round: RoundRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: RoundUpdateComponent,
    resolve: {
      round: RoundRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: RoundUpdateComponent,
    resolve: {
      round: RoundRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(roundRoute)],
  exports: [RouterModule],
})
export class RoundRoutingModule {}
