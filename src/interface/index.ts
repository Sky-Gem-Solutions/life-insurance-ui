interface FormData {
    age: string;
    income: string;
    dependents: string;
    risk: string;
};

interface Recommendation {
    age: Range;
    riskTolerance: "low" | "medium" | "high";
    dependents: Range;
    income: Range;
    plan: string;
    coverage: string;
    termLength: string;
    explanation: string;
}

interface Range {
    min: number;
    max: number;
}

export type { FormData, Recommendation, Range }