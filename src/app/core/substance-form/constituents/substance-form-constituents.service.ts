import { Injectable } from '@angular/core';
import { SubstanceFormConstituentsModule } from './substance-form-constituents.module';
import { SubstanceFormService } from '../substance-form.service';
import { ReplaySubject, Observable } from 'rxjs';
import { Constituent } from '@gsrs-core/substance/substance.model';
import { SubstanceFormServiceBase } from '../base-classes/substance-form-service-base';

@Injectable({
  providedIn: SubstanceFormConstituentsModule
})
export class SubstanceFormConstituentsService extends SubstanceFormServiceBase {

  constructor(
    private substanceFormService: SubstanceFormService
  ) {
    super(substanceFormService);
    this.propertyEmitter = new ReplaySubject<Array<Constituent>>();
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      if (this.substance.specifiedSubstance.constituents == null) {
        this.substance.specifiedSubstance.constituents = [];
      }
      this.substanceFormService.resetState();
      this.propertyEmitter.next(this.substance.specifiedSubstance.constituents);
    });
    this.subscriptions.push(subscription);
  }

  get substanceConstituents(): Observable<Array<Constituent>> {
    return this.propertyEmitter.asObservable();
  }

  addSubstanceConstituent(): void {
    const constituent: Constituent = {};
    this.substance.specifiedSubstance.constituents.unshift(constituent);
    this.propertyEmitter.next(this.substance.specifiedSubstance.constituents);
  }

  deleteSubstanceConstituent(sugar: Constituent): void {
    const constituentIndex = this.substance.specifiedSubstance.constituents.findIndex(
      subCode => sugar.$$deletedCode === subCode.$$deletedCode);
    if (constituentIndex > -1) {
      this.substance.specifiedSubstance.constituents.splice(constituentIndex, 1);
      this.propertyEmitter.next(this.substance.specifiedSubstance.constituents);
    }
  }
}
