import { baseEnvironment } from './_base-environment';

export const environment = baseEnvironment;
// __alex__ should make change here.
environment.navItems = [
    {
        display: 'Browse Application',
        path: 'browse-applications'
    },
    {
        display: 'Browse Clinical Trials',
        path: 'browse-clinical-trials'
    }
];
environment.appId = 'fda';
environment.isAnalyticsPrivate = true;
environment.configFileLocation = '/assets/data/config-fda.json';

environment.apiBaseUrl = 'http://localhost:9000/ginas/app/';

export { FdaModule as EnvironmentModule } from '../app/fda/fda.module';
