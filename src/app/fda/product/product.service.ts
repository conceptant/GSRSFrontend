import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '@gsrs-core/config/config.service';
import { BaseHttpService } from '@gsrs-core/base/base-http.service';
import { Observable,  } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class ProductService extends BaseHttpService {

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
  ) {
    super(configService);
  }

  getSubstanceProducts(substanceId: string): Observable<Array<any>> {
    return this.http.get<Array<any>>('/assets/data/gsrs-products-test.json');
  }

  getProduct(productId: number): Observable<any> {
    return this.http.get<any>('/assets/data/gsrs-products-test.json').pipe(
      map(products => {
        return products[0];
      })
    );
  }
}