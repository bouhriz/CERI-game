import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { Authentification } from './service/authentification.service';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BandeauComponent } from './bandeau/bandeau.component';
import { LoginComponent } from './login/login.component';
import { ProfilComponent } from './profil/profil.component';
import { QuizComponent } from './quiz/quiz.component';
import { ResultatComponent } from './resultat/resultat.component';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    BandeauComponent,
    LoginComponent,
    ProfilComponent,
    QuizComponent,
    ResultatComponent,
    HomeComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [Authentification],
  bootstrap: [AppComponent]
})
export class AppModule { }
