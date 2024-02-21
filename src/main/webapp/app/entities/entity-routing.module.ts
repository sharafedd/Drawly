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
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}
