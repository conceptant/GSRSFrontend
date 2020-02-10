import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { SubstanceFormModule } from '../substance-form.module';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ScrollToModule } from '../../scroll-to/scroll-to.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import {SubstanceFormPhysicalModificationsComponent} from '@gsrs-core/substance-form/substance-form-physical-modifications/substance-form-physical-modifications.component';
import {SubstanceFormAgentModificationsComponent} from '@gsrs-core/substance-form/substance-form-agent-modifications/substance-form-agent-modifications.component';

@NgModule({
  imports: [
    CommonModule,
    DynamicComponentLoaderModule.forChild(SubstanceFormPhysicalModificationsComponent),
    SubstanceFormModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    ScrollToModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    MatInputModule
  ],
  declarations: [
    SubstanceFormPhysicalModificationsComponent
  ]
})
export class SubstanceFormPhysicalModificationsModule { }