export interface CarbonOption {
    value: string,
    text?: string,
    icon?: string,
}

export interface CarbonField {
    name: string,
    stage: number,
    element: 'radio' | 'number',
    options?: CarbonOption[],
    values?: Record<string, number>,
    validation?: { min: number, max: number, },
    conditional?: Record<string, string | string[]>,
    multiplyByNumber?: number,
    multiplyByAnswer?: { question: string, minimum: number, },
    multiplyByValue?: { question: string, minimum: number, },
    isClone?: boolean,
    originalNumber?: number,
}

export interface ComparisonReplacement {
    repl: string,
    divisor: number,
}

export interface CarbonFormData {
    stages: number,
    fields: CarbonField[],
    repeatableStages?: number[],
    comparisonReplacements?: ComparisonReplacement[],
}

export interface CarbonFieldUpdate {
    field: string,
    value: string | number,
    errors?: string[],
}

export type CarbonLabels = Record<string, string | number> & { formUrl?: string, };
