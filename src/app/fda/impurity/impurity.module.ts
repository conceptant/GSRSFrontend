import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, Routes, RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SubstanceFormModule } from '../../core/substance-form/substance-form.module';
import { SubstanceSearchSelectorModule } from '../substance-search-select/substance-search-selector.module';
// import { SubstanceSelectorComponent } from '../../core/substance-selector/substance-selector.component';
import { SubstanceSelectorModule } from '../../core/substance-selector/substance-selector.module';
import { ImpurityFormComponent } from './impurity-form/impurity-form.component';
import { ImpuritiesFormComponent } from './impurity-form/impurities-form/impurities-form.component';

const impurityRoutes: Routes = [
  {
    path: 'impurity/register',
    component: ImpurityFormComponent
  }
];

@NgModule({
  declarations: [ImpurityFormComponent, ImpuritiesFormComponent],
  imports: [
    RouterModule.forChild(impurityRoutes),
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatCardModule,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    SubstanceFormModule,
    SubstanceSearchSelectorModule,
    SubstanceSelectorModule
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
