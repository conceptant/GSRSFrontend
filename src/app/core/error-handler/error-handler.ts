import { ErrorHandler, Injectable } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  
  handleError(error: any): void {
   const chunkFailedMessage = /Loading chunk/;
    if (chunkFailedMessage.test(error.message)) {
      if (confirm('There was a network error while fetching files, would you like to refresh?')) {
        window.location.reload(true);
      }
    } else {
      console.error(error);
    }
  }
}
