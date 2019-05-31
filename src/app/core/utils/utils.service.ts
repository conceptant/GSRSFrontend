import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseHttpService } from '../base/base-http.service';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { SubstanceSuggestionsGroup } from './substance-suggestions-group.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class UtilsService extends BaseHttpService {
  private bodyElement: HTMLBodyElement;
  private matSidenavContentElement: HTMLElement;

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
    private sanitizer: DomSanitizer
  ) {
    super(configService);
  }

  getStructureSearchSuggestions(searchTerm: string): Observable<SubstanceSuggestionsGroup> {
    return this.http.get<SubstanceSuggestionsGroup>(this.apiBaseUrl + 'suggest?q=' + searchTerm);
  }

  getSafeStructureImgUrl(structureId: string, size: number = 150, stereo?: boolean): SafeUrl {
    if (!stereo) {
      stereo = false;
    }
    const imgUrl = `${this.configService.configData.apiBaseUrl}img/${structureId}.svg?size=${size.toString()}&stereo=${stereo}`;
    return this.sanitizer.bypassSecurityTrustUrl(imgUrl);
  }

  handleMatSidenavOpen(widthBreakingPoint?: number): void {

    if (widthBreakingPoint == null || (window && window.innerWidth < widthBreakingPoint)) {
      this.bodyElement = document.getElementsByTagName('BODY')[0] as HTMLBodyElement;
      this.matSidenavContentElement = document.getElementsByTagName('mat-sidenav-content')[0] as HTMLElement;

      this.bodyElement.style.overflowX = 'hidden';
      this.matSidenavContentElement.style.width = `${this.matSidenavContentElement.offsetWidth}px`;
    } else {
      this.handleMatSidenavClose();
    }
  }

  handleMatSidenavClose(): void {
    if (this.bodyElement != null || this.matSidenavContentElement != null) {
      setTimeout(() => {
        this.bodyElement.style.overflowX = null;
        this.matSidenavContentElement.style.width = null;
        this.bodyElement = null;
        this.matSidenavContentElement = null;
      }, 500);
    }
  }

  capitalize(phrase: string): string {
    const stringArray = phrase.split(' ');

    for (let i = 0, x = stringArray.length; i < x; i++) {
      stringArray[i] = stringArray[i][0].toUpperCase() + stringArray[i].substr(1);
    }

    return stringArray.join(' ');
  }

  /* tslint:disable:no-bitwise */
  hashCode(...args): number {
    const stringToHash = JSON.stringify([...args]);
    let hash = 0, i, chr;
    if (stringToHash.length === 0) {
      return hash;
    }
    for (i = 0; i < stringToHash.length; i++) {
      chr   = stringToHash.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  }

  toCamelCase(term: string = ''): string {
    return term
        .replace(/\s(.)/g, ($1) => $1.toUpperCase())
        .replace(/\s/g, '')
        .replace(/^(.)/, ($1) => $1.toLowerCase());
  }

  // https://gist.github.com/jed/982883
  newUUID(
    a?: number                  // placeholder
  ) {
    return a           // if the placeholder was passed, return
      ? (              // a random number from 0 to 15
        a ^            // unless b is 8,
        Math.random()  // in which case
        * 16           // a random number from
        >> a / 4         // 8 to 11
        ).toString(16) // in hexadecimal
      : (              // or otherwise a concatenated string:
        [1e7] as any +        // 10000000 +
        -1e3 +         // -1000 +
        -4e3 +         // -4000 +
        -8e3 +         // -80000000 +
        -1e11          // -100000000000,
        ).replace(     // replacing
          /[018]/g,    // zeroes, ones, and eights with
          this.newUUID            // random hex digits
        );
  }
}
