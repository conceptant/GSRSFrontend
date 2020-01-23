import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SubstanceTextSearchComponent } from './substance-text-search.component';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  imports: [
    CommonModule,
    MatIconModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ],
  declarations: [
    SubstanceTextSearchComponent
  ],
  exports: [
    SubstanceTextSearchComponent
  ]
})
export class SubstanceTextSearchModule { }
