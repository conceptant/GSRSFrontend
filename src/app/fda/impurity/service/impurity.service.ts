import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { PagingResponse } from '@gsrs-core/utils';
import { Impurity, ImpurityTest, Impurities, ValidationResults } from '../model/impurity.model';
import { map, switchMap } from 'rxjs/operators';
import { FacetParam, FacetHttpParams, FacetQueryResponse } from '@gsrs-core/facets-manager';
import { Facet } from '@gsrs-core/facets-manager';

@Injectable(
  {
    providedIn: 'root',
  }
)

export class ImpurityService extends BaseHttpService {

  totalRecords: 0;
  impurity: Impurity;

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
  }

  loadImpurity(impurity?: Impurity): void {
    // if Update/Exist Impurity
    if (impurity != null) {
      this.impurity = impurity;
      //  console.log('AFTER' + JSON.stringify(this.application));
    } else {
      this.impurity = {
        impuritiesList: [],
        impurityTestList: []
      };
    }
    //  });
  }

  saveApplication(): Observable<Impurity> {
    const url = this.apiBaseUrl + `impurity`;
    const params = new HttpParams();
    const options = {
      params: params,
      type: 'JSON',
      headers: {
        'Content-type': 'application/json'
      }
    };
    //  console.log('APP: ' + this.application);

    // Update Impurity
    if ((this.impurity != null) && (this.impurity.id)) {
      return this.http.put<Impurity>(url, this.impurity, options);
    } else {
      // Save New Application
      return this.http.post<Impurity>(url, this.impurity, options);
    }
  }

  validateApplication(): Observable<ValidationResults> {
    return new Observable(observer => {
      this.validateApp().subscribe(results => {
        observer.next(results);
        observer.complete();
      }, error => {
        observer.error();
        observer.complete();
      });
    });
  }

  validateApp(): Observable<ValidationResults> {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/applicationssrs/@validate`;
    return this.http.post(url, this.impurity);
  }

  deleteApplication(): Observable<any> {
    const url = this.apiBaseUrl + 'impurity(' + this.impurity.id + ')';
    const params = new HttpParams();
    const options = {
      params: params
    };
    const x = this.http.delete<Impurity>(url, options);
    return x;
  }

  getJson() {
    return this.impurity;
  }

  addNewTest(): void {
    const newTest: ImpurityTest = {};
    this.impurity.impurityTestList.unshift(newTest);
  }

  addNewImpurities(): void {
    const newImpurities: Impurities = {};
    this.impurity.impuritiesList.unshift(newImpurities);
  }
  
  getRelationshipImpurity(
    substanceId: string
  ): Observable<any> {
    const url = this.baseUrl + 'getRelationshipImpurity?substanceId=' + substanceId;
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

} // class
