import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { WelcomeComponent } from './pages/welcome/welcome.component';
import { DetailsComponent } from './pages/details/details.component';
import { DepartmentComponent } from './pages/department/department.component';
import { QueueComponent } from './pages/queue/queue.component';

const routes: Routes = [
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
  { path: 'welcome', component: WelcomeComponent },
  { path: 'details', component: DetailsComponent },
  { path: 'department', component: DepartmentComponent },
  { path: 'queue', component: QueueComponent },
  { path: '**', redirectTo: 'welcome' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}