export interface Employee {
    [firstName: string]: string;
    [lastName: string]: string;
    id?: number;
    dependents?: Dependent[];
    annualCost?: number;
} 

export type Dependent = {
    firstName: string;
    lastName: string;
    relationship: string;
    annualCost?: number;
} 