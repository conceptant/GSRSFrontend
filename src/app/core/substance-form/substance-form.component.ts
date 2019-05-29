import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChildren,
  ViewContainerRef,
  QueryList
} from '@angular/core';
import { formSections } from './form-sections.constant';
import { ActivatedRoute, Router } from '@angular/router';
import { SubstanceService } from '../substance/substance.service';
import { SubstanceDetail } from '../substance/substance.model';
import { LoadingService } from '../loading/loading.service';
import { MainNotificationService } from '../main-notification/main-notification.service';
import { AppNotification, NotificationType } from '../main-notification/notification.model';
import { DynamicComponentLoader } from '../dynamic-component-loader/dynamic-component-loader.service';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { Subject } from 'rxjs';
import { SubstanceFormSection } from './substance-form-section';

@Component({
  selector: 'app-substance-form',
  templateUrl: './substance-form.component.html',
  styleUrls: ['./substance-form.component.scss']
})
export class SubstanceFormComponent implements OnInit, AfterViewInit {
  isLoading = true;
  id?: string;
  substance: SubstanceDetail;
  formSections: Array<SubstanceFormSection> = [];
  substanceUpdated = new Subject<SubstanceDetail>();
  @ViewChildren('dynamicComponent', { read: ViewContainerRef }) dynamicComponents: QueryList<ViewContainerRef>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private substanceService: SubstanceService,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private router: Router,
    private dynamicComponentLoader: DynamicComponentLoader,
    private gaService: GoogleAnalyticsService
  ) {
  }

  ngOnInit() {
    this.loadingService.setLoading(true);
    this.id = this.activatedRoute.snapshot.params['id'];
    if (this.id) {
      this.gaService.sendPageView(`Substance Edit`);
      this.getSubstanceDetails();
    } else {
      this.gaService.sendPageView(`Substance Register`);
      const kind = this.activatedRoute.snapshot.queryParamMap.get('kind') || 'chemical';
      this.substance = {};
      this.setFormSections(formSections[kind]);
    }
  }

  ngAfterViewInit(): void {
    this.dynamicComponents.changes
      .subscribe(() => {
        this.dynamicComponents.forEach((cRef, index) => {
          this.dynamicComponentLoader
              .getComponentFactory<any>(this.formSections[index].dynamicComponentName)
              .subscribe(componentFactory => {
                this.formSections[index].dynamicComponentRef = cRef.createComponent(componentFactory);
                this.formSections[index].dynamicComponentRef.instance.substance = this.substance;
                this.formSections[index].dynamicComponentRef.instance.substanceUpdated = this.substanceUpdated.asObservable();
                this.formSections[index].dynamicComponentRef.instance.menuLabelUpdate.subscribe(label => {
                  this.formSections[index].menuLabel = label;
                });
                this.formSections[index].dynamicComponentRef.changeDetectorRef.detectChanges();
                this.substanceUpdated.next(this.substance);
              });
        });
      });
  }

  getSubstanceDetails() {
    this.substanceService.getSubstanceDetails(this.id).subscribe(response => {
      if (response) {
        this.substance = response;
        this.setFormSections(formSections[this.substance.substanceClass]);
      } else {
        this.handleSubstanceRetrivalError();
      }
      this.loadingService.setLoading(false);
      this.isLoading = false;
    }, error => {
      this.gaService.sendException('getSubstanceDetails: error from API call');
      this.loadingService.setLoading(false);
      this.isLoading = false;
      this.handleSubstanceRetrivalError();
    });
  }

  private setFormSections(sectionNames: Array<string> = []): void {
    sectionNames.forEach(sectionName => {
      const formSection = new SubstanceFormSection(sectionName);
      this.formSections.push(formSection);
    });
  }

  private handleSubstanceRetrivalError() {
    const notification: AppNotification = {
      message: 'The substance you\'re trying to edit doesn\'t exist.',
      type: NotificationType.error,
      milisecondsToShow: 4000
    };
    this.mainNotificationService.setNotification(notification);
    setTimeout(() => {
      this.router.navigate(['/substances/register']);
      this.substance = {};
      this.setFormSections(formSections.chemical);
    }, 5000);
  }

  submit(): void {
    this.isLoading = true;
    this.loadingService.setLoading(true);
    this.substanceService.saveSubstance(this.substance).subscribe(response => {
      this.substance = response;
      this.substanceUpdated.next(response);
      this.loadingService.setLoading(false);
      this.isLoading = false;
      const notification: AppNotification = {
        message: 'Substance was saved successfully!',
        type: NotificationType.success
      };
      this.mainNotificationService.setNotification(notification);
    }, error => {
      this.loadingService.setLoading(false);
      this.isLoading = false;
    });
  }
}
