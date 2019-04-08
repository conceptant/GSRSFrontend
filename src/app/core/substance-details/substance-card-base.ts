import { SubstanceDetail } from '../substance/substance.model';

export abstract class SubstanceCardBase {
    substance: SubstanceDetail;
    title: string;
    analyticsEventCategory: string;
}