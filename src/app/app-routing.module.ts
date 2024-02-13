import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { QuizComponent } from './quiz/quiz.component'
import { ProfilComponent } from './profil/profil.component'
import { HomeComponent } from './home/home.component'
import { ResultatComponent } from './resultat/resultat.component'
const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'profil',
    component: ProfilComponent
  },
  {
    path: 'resultat',
    component: ResultatComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'quiz',
    component: QuizComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
