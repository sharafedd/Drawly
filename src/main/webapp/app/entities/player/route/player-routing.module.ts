import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { PlayerComponent } from '../list/player.component';
import { PlayerDetailComponent } from '../detail/player-detail.component';
import { PlayerUpdateComponent } from '../update/player-update.component';
import { PlayerRoutingResolveService } from './player-routing-resolve.service';
import { ASC } from 'app/config/navigation.constants';

const playerRoute: Routes = [
  {
    path: '',
    component: PlayerComponent,
    data: {
      defaultSort: 'id,' + ASC,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: PlayerDetailComponent,
    resolve: {
      player: PlayerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: PlayerUpdateComponent,
    resolve: {
      player: PlayerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: PlayerUpdateComponent,
    resolve: {
      player: PlayerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(playerRoute)],
  exports: [RouterModule],
})
export class PlayerRoutingModule {}
