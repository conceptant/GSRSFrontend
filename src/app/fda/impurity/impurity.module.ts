import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, Routes, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { ImpurityFormComponent } from './impurity-form/impurity-form.component';

const impurityRoutes: Routes = [
  {
    path: 'impurity/register',
    component: ImpurityFormComponent
  }
];

@NgModule({
  declarations: [ImpurityFormComponent],
  imports: [
    RouterModule.forChild(impurityRoutes),
    CommonModule,
    MatCardModule
  ]
})

export class ImpurityModule { 
  constructor(router: Router) {
    impurityRoutes.forEach(route => {
      router.config[0].children.push(route);
    });
  }

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ImpurityModule,
      providers: [
      ]
    };
  }

}
