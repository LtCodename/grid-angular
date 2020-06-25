import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const routes: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'season',
    loadChildren: () => import('./seasons/seasons.module').then(m => m.SeasonsModule)
  },
  {
    path: 'drivers',
    loadChildren: () => import('./drivers/drivers.module').then(m => m.DriversModule)
  },
  {
    path: 'teams',
    loadChildren: () => import('./teams/teams.module').then(m => m.TeamsModule)
  },
  {
    path: 'race',
    loadChildren: () => import('./races/races.module').then(m => m.RacesModule)
  },
  {
    path: '**',
    redirectTo: 'season'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
