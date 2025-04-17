import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { DeckListComponent } from './components/ui/deck-list/deck-list.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'deck-list', component: DeckListComponent },
  //   { path: 'login', component: LoginComponent },
  //   { path: 'logout', component: LogoutComponent },
];
//, canActivate: [myGuardGuard]
