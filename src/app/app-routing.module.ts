import { NgModule } from '@angular/core'
import { RouterModule, Routes } from '@angular/router'
import { AnswerComponent } from './form/answer/answer.component'
import { BuildComponent } from './form/build/build.component'

const routes: Routes = [
  {
    path: 'form/build',
    component: BuildComponent,
  },
  {
    path: 'form/answer',
    component: AnswerComponent,
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
