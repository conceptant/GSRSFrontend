import { Component, OnInit, Input } from '@angular/core';
import { Impurity, SubRelationship, Impurities, ValidationMessage } from '../../model/impurity.model';
import { ImpurityService } from '../../service/impurity.service';
import { LoadingService } from '@gsrs-core/loading';

@Component({
  selector: 'app-impurities-form',
  templateUrl: './impurities-form.component.html',
  styleUrls: ['./impurities-form.component.scss']
})
export class ImpuritiesFormComponent implements OnInit {

  @Input() impurity: Impurity;
  public subRelationship: Array<SubRelationship> = [];
  substanceName: string;

  constructor(
    private impurityService: ImpurityService,
    private loadingService: LoadingService) { }

  ngOnInit() {
    if (this.impurity) {
      this.substanceName = 'ZIDOVUDINE';
      this.impurity.parentSubstanceId = '479f1396-4958-4f59-9d41-0bd0468c8da7';
    }
  }

  addNewImpurities() {
    this.impurityService.addNewImpurities();
  }

  getImpurities() {
    // alert('GGG');
    this.loadingService.setLoading(true);
    this.impurityService.getRelationshipImpurity(this.impurity.parentSubstanceId).subscribe(response => {
      if (response) {
        this.subRelationship = response.data;

        //  this.impurity.impuritiesList[0].relationshipList = response[0];
        console.log(JSON.stringify(this.subRelationship));
      //  alert(this.subRelationship.length);
      }
    });

    // alert(this.subRelationship.length);
    if (this.subRelationship.length > 0) {
      this.getRelationship();
    }

    this.loadingService.setLoading(false);
    //  this.isLoading = false;
  }

  getRelationship() {
    // alert(this.subRelationship.length);
    this.subRelationship.forEach((elementRel, indexRel) => {
      console.log('Index: ' + indexRel);
      this.createNewImpurities(elementRel.relationshipUuid);
      //  this.addNewImpurities();
      //  alert(indexRel);
      //     this.impurity.impuritiesList[indexRel].testType = 'Type' + indexRel;

      // this.impurity.impuritiesList[indexRel].subRelationship = elementRel;
      // this.impurity.impuritiesList[indexRel].maturityType = 'Type' + indexRel;
      console.log('AAAA' + JSON.stringify(elementRel));
      //   console.log('GG' + JSON.stringify(this.impurity.impuritiesList[indexRel].subRelationship));
      // alert(this.impurity.impuritiesList.length);
    });

    //  this.impurity.impuritiesList[0].maturityType = 'Test';
  }

  createNewImpurities(relationshipUuid: string) {
    const newImpurities: Impurities = {};
  //  newImpurities.testType = 'Test';
  //  newImpurities.highLimit = 0;
    newImpurities.relatedSubstanceUuid = relationshipUuid;
    this.impurity.impuritiesList.unshift(newImpurities);
  }

  getRelationshipImpurity(substanceId: string) {
    this.impurityService.getRelationshipImpurity(substanceId);
  }

}
