import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { BaseHttpService } from '../base/base-http.service';
import { Observable, Subject, forkJoin, throwError } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { PagingResponse } from '../utils/paging-response.model';
import { map, catchError, retry } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AdminService extends BaseHttpService {

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
  }

  public fetchJobs(): Observable<any> {
    console.log('getting all');
    const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
    return this.http.get<any>(`${url}scheduledjobs`);
  }

  public fetchJob(id: string): Observable<any> {
    const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;
    // console.log(`${url}scheduledjobs(${id})`);
    return this.http.get<any>(`${url}scheduledjobs(${id})`);

  }

  public runJob(job: string): Observable<any> {
    console.log(job);
    if(!job){
      job = "http://localhost:9000/ginas/app/api/v1/scheduledjobs(1)/$@cancel"
    }
    return this.http.get<any>(job).pipe(retry(2), catchError(err => {console.log(err); return throwError(err)}));
      }




}