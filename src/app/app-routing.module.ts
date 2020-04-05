import { HomeComponent } from './components/home/home.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { LoginComponent } from './components/login/login.component';
import { RegisteComponent } from './components/registe/registe.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {path:    ''    ,component:HomeComponent },
  {path:'register',component:RegisteComponent},
  {path:'login'   ,component:LoginComponent},
  {path:'notFound',component:NotFoundComponent},
  {path:'*'       ,component:NotFoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
