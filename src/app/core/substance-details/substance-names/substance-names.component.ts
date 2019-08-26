import {Component, OnInit, AfterViewInit} from '@angular/core';
import { SubstanceCardBaseFilteredList } from '../substance-card-base-filtered-list';
import {SubstanceDetail, SubstanceName} from '../../substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import {MatDialog} from '@angular/material';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import {Subject} from 'rxjs';
import {Sort} from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-substance-names',
  templateUrl: './substance-names.component.html',
  styleUrls: ['./substance-names.component.scss']
})
export class SubstanceNamesComponent extends SubstanceCardBaseFilteredList<SubstanceName> implements OnInit {
  names: Array<SubstanceName>;
  displayedColumns: string[] = ['name', 'type', 'language', 'references'];
  languageVocabulary: { [vocabularyTermValue: string]: VocabularyTerm } = {};
  typeVocabulary: { [vocabularyTermValue: string]: VocabularyTerm } = {};
  substanceUpdated = new Subject<SubstanceDetail>();
  private overlayContainer: HTMLElement;

  constructor(
    private dialog: MatDialog,
    public gaService: GoogleAnalyticsService,
    private cvService: ControlledVocabularyService,
    private overlayContainerService: OverlayContainer
  ) {
    super(gaService);
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      if (this.substance != null && this.substance.names != null) {
        this.names = this.substance.names;
        this.filtered = this.substance.names;
        this.countUpdate.emit(this.names.length);
        this.searchControl.valueChanges.subscribe(value => {
          this.filterList(value, this.names, this.analyticsEventCategory);
        }, error => {
          console.log(error);
        });
        this.getVocabularies();

        // move display name to top
        this.filtered = this.names.slice().sort((a, b) => {
          return (b.displayName === true ? 1 : -1);
        });
      }

      this.pageChange();
      });
      this.overlayContainer = this.overlayContainerService.getContainerElement();
  }



  sortData(sort: Sort) {
    const data = this.names.slice();
    if (!sort.active || sort.direction === '') {
      this.filtered = data;
      this.pageChange();
      return;
    }
    this.filtered = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'name': return compare(a.name.toUpperCase(), b.name.toUpperCase(), isAsc);
        case 'type': return compare(a.type, b.type, isAsc);
        case 'language': return compare(this.getLanguages(a), this.getLanguages(b), isAsc);
        default: return 0;
      }
    });
    this.pageChange();
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('LANGUAGE', 'NAME_TYPE').subscribe(response => {
      this.languageVocabulary = response['LANGUAGE'] && response['LANGUAGE'].dictionary;
      this.typeVocabulary = response['NAME_TYPE'] && response['NAME_TYPE'].dictionary;
    });
  }

  getLanguages(name: SubstanceName): string {
    if (this.languageVocabulary != null && name.languages && name.languages.length) {
      const languagesArray = [];
      name.languages.forEach(language => {
        if (this.languageVocabulary[language] != null) {
          languagesArray.push(this.languageVocabulary[language].display);
        }
      });
      return languagesArray.join(', ');
    } else {
      return '';
    }
  }

  openModal(templateRef) {

    this.gaService.sendEvent(this.analyticsEventCategory, 'button', 'references view');

    const dialogRef = this.dialog.open(templateRef, {
      minWidth: '40%',
      maxWidth: '90%'
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(result => {
      this.overlayContainer.style.zIndex = null;
    });
  }

}

function compare(a: number | string, b: number | string, isAsc: boolean) {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
