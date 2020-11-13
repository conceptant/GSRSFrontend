import { Component, OnInit, AfterViewInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ImpurityService } from '../service/impurity.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ControlledVocabularyService } from '../../../core/controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../../core/controlled-vocabulary/vocabulary.model';
import { Impurity, ValidationMessage } from '../model/impurity.model';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { JsonDialogFdaComponent } from '../../json-dialog-fda/json-dialog-fda.component';
import { ConfirmDialogComponent } from '../../confirm-dialog/confirm-dialog.component';
import { finalize } from 'rxjs/operators';
import { CvInputComponent } from '@gsrs-core/substance-form/cv-input/cv-input.component';
import { anyExistsFilter } from '@gsrs-core/substance-details';
import { DatePipe } from '@angular/common';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { FormBuilder } from '@angular/forms';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NativeDateAdapter, DateAdapter, MAT_NATIVE_DATE_FORMATS } from '@angular/material';
import { element } from 'protractor';

@Component({
  selector: 'app-impurity-form',
  templateUrl: './impurity-form.component.html',
  styleUrls: ['./impurity-form.component.scss']
})
export class ImpurityFormComponent implements OnInit {

  impurity: Impurity;
  id?: number;
  isLoading = true;
  showSubmissionMessages = false;
  submissionMessage: string;
  validationMessages: Array<ValidationMessage> = [];
  validationResult = false;
  private subscriptions: Array<Subscription> = [];
  copy: string;
  private overlayContainer: HTMLElement;
  serverError: boolean;
  isDisableData = false;
  username = null;
  title = null;
  submitDateMessage = '';
  statusDateMessage = '';
  appForm: FormGroup;
  isAdmin = false;

  constructor(private impurityService: ImpurityService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private gaService: GoogleAnalyticsService,
    private utilsService: UtilsService,
    private cvService: ControlledVocabularyService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private overlayContainerService: OverlayContainer,
    private dialog: MatDialog,
    private fb: FormBuilder) { }

  ngOnInit() {

    // this.generateFormContorls();
    this.isAdmin = this.authService.hasRoles('admin');
    this.loadingService.setLoading(true);
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    this.username = this.authService.getUser();
    const routeSubscription = this.activatedRoute
      .params
      .subscribe(params => {
        if (params['id']) {
          const id = params['id'];
          this.title = 'Update Impurity';
          if (id !== this.id) {
            this.id = id;
            this.gaService.sendPageView(`Impurity Edit`);
         //   this.getApplicationDetails();
            //   this.getVocabularies();
          }
        } else {
          this.title = 'Register New Impurity';
          setTimeout(() => {
            this.gaService.sendPageView(`Impurity Register`);
            this.impurityService.loadImpurity();
            this.impurity = this.impurityService.impurity;
            //  this.getVocabularies();
            this.loadingService.setLoading(false);
            this.isLoading = false;
          });
        }
      });
    this.subscriptions.push(routeSubscription);
  }

  ngAfterViewInit(): void {
  }

  ngOnDestroy(): void {
    // this.applicationService.unloadSubstance();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

}
