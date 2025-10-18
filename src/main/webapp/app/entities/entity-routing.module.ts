import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'post',
        data: { pageTitle: 'Posts' },
        loadChildren: () => import('./post/post.module').then(m => m.PostModule),
      },
      {
        path: 'prompt',
        data: { pageTitle: 'Prompts' },
        loadChildren: () => import('./prompt/prompt.module').then(m => m.PromptModule),
      },
      {
        path: 'competition',
        data: { pageTitle: 'Competitions' },
        loadChildren: () => import('./competition/competition.module').then(m => m.CompetitionModule),
      },
      {
        path: 'competition-prompt',
        data: { pageTitle: 'CompetitionPrompts' },
        loadChildren: () => import('./competition-prompt/competition-prompt.module').then(m => m.CompetitionPromptModule),
      },
      {
        path: 'comment',
        data: { pageTitle: 'Comments' },
        loadChildren: () => import('./comment/comment.module').then(m => m.CommentModule),
      },
      {
        path: 'room',
        data: { pageTitle: 'Rooms' },
        loadChildren: () => import('./room/room.module').then(m => m.RoomModule),
      },
      {
        path: 'round',
        data: { pageTitle: 'Rounds' },
        loadChildren: () => import('./round/round.module').then(m => m.RoundModule),
      },
      {
        path: 'round-prompt',
        data: { pageTitle: 'RoundPrompts' },
        loadChildren: () => import('./round-prompt/round-prompt.module').then(m => m.RoundPromptModule),
      },
      {
        path: 'player',
        data: { pageTitle: 'Players' },
        loadChildren: () => import('./player/player.module').then(m => m.PlayerModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
