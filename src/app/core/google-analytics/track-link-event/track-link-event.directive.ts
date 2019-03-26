import { Directive, HostListener, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { GoogleAnalyticsService } from '../google-analytics.service';

@Directive({
  selector: '[appTrackLinkEvent]'
})
export class TrackLinkEventDirective {
  @Input() evCategory = 'Undefined';
  @Input() evAction = 'click-link';
  @Input() evLabel: string;
  @Input() evValue: number;

  constructor(
    private gaService: GoogleAnalyticsService
  ) {}

  @HostListener('click', ['$event.target'])
  onClick(element) {

    if (environment.isAnalyticsPrivate) {
      this.evLabel = 'link';
    } else if (!this.evLabel && element.href) {
      this.evLabel = element.href;
    }

    this.gaService.sendEvent(this.evCategory, this.evAction, this.evLabel, this.evValue);
  }
}
