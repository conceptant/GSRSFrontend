import { Component, OnInit, Input, Output, EventEmitter, ComponentFactoryResolver, Inject, ViewChild } from '@angular/core';
import { SubstanceDetail } from '../../substance/substance.model';
import { DYNAMIC_COMPONENT_MANIFESTS, DynamicComponentManifest } from '@gsrs-core/dynamic-component-loader';
import { CardDynamicSectionDirective } from '../card-dynamic-section/card-dynamic-section.directive';
import { UtilsService } from '../../utils/utils.service';
import { SafeUrl } from '@angular/platform-browser';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AuthService } from '@gsrs-core/auth';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { StructureService } from '@gsrs-core/structure';
import { SubstanceSummaryDynamicContent } from './substance-summary-dynamic-content.component';

@Component({
  selector: 'app-substance-summary-card',
  templateUrl: './substance-summary-card.component.html',
  styleUrls: ['./substance-summary-card.component.scss']
})
export class SubstanceSummaryCardComponent implements OnInit {
  private privateSubstance: SubstanceDetail;
  @Output() openImage = new EventEmitter<SubstanceDetail>();
  @Input() showAudit: boolean;
  isAdmin = false;
  @ViewChild(CardDynamicSectionDirective, {static: true}) dynamicContentContainer: CardDynamicSectionDirective;

  constructor(
    public utilsService: UtilsService,
    public gaService: GoogleAnalyticsService,
    public authService: AuthService,
    private substanceService: SubstanceService,
    private structureService: StructureService,
    private componentFactoryResolver: ComponentFactoryResolver,
    @Inject(DYNAMIC_COMPONENT_MANIFESTS) private dynamicContentItems: DynamicComponentManifest<any>[]

  ) { }

  ngOnInit() {
    this.isAdmin = this.authService.hasRoles('admin');
  }

  @Input()
  set substance(substance: SubstanceDetail) {
    if (substance != null) {
      this.privateSubstance = substance;
      this.loadDynamicContent();
    }
  }

  get substance(): SubstanceDetail {
    return this.privateSubstance;
  }

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    return this.utilsService.getSafeStructureImgUrl(structureId, size);
  }

  openImageModal(): void {
    this.openImage.emit(this.substance);
  }

  getFasta(id: string, filename: string): void {
    this.substanceService.getFasta(id).subscribe(response => {
      this.downloadFile(response, filename);
    });
  }

  getMol(id: string, filename: string): void {
    this.structureService.downloadMolfile(id).subscribe(response => {
      this.downloadFile(response, filename);
    });
  }

  downloadFile(response: any, filename: string): void {
    const dataType = response.type;
    const binaryData = [];
    binaryData.push(response);
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
    downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  loadDynamicContent(): void {
    const viewContainerRef = this.dynamicContentContainer.viewContainerRef;
    viewContainerRef.clear();
    const dynamicContentItemsFlat =  this.dynamicContentItems.reduce((acc, val) => acc.concat(val), []);
    dynamicContentItemsFlat.forEach(dynamicContentItem => {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(dynamicContentItem.component);
      const componentRef = viewContainerRef.createComponent(componentFactory);
      (<SubstanceSummaryDynamicContent>componentRef.instance).substance = this.privateSubstance;
    })
  }
}
