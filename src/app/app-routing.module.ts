import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProgressbarComponent } from './pages/progressbar/progressbar.component';
import { SettingComponent } from './pages/setting/setting.component';

const routes: Routes = [{
  path: '',
  component: ProgressbarComponent
}, {
  path: 'pro/:id',
  component: ProgressbarComponent
}, {
  path: 'settings',
  component: SettingComponent
}];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
