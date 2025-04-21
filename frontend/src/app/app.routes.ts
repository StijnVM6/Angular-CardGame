import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { GameComponent } from './components/pages/game/game.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'game', component: GameComponent },
  //   { path: 'login', component: LoginComponent },
  //   { path: 'logout', component: LogoutComponent },
];
//, canActivate: [myGuardGuard]
