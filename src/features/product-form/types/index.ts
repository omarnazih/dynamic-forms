export type InputType = 'input_raw' | 'input_selection' | 'input_media';
export type InputFormat =
    | 'text'
    | 'textarea'
    | 'number'
    | 'dimension'
    | 'drop'
    | 'multi_text'
    | 'images';

export interface BaseInput {
    input_type: InputType;
    input_format: InputFormat;
    input_name: string;
    label: string;
    order: number;
}

export interface RawInput extends BaseInput {
    input_type: 'input_raw';
    max_length?: number;
}

export interface SelectionInput extends BaseInput {
    input_type: 'input_selection';
    count: number;
    options?: string[];
}

export interface MediaInput extends BaseInput {
    input_type: 'input_media';
    accepted_formats: string[];
    max_count: number;
}

export type FormInput = RawInput | SelectionInput | MediaInput;

export interface FormStep {
    step_name: string;
    inputs: FormInput[];
}

export interface FormSchema {
    form_name: string;
    steps_count: number;
    form_steps: FormStep[];
}

export type FormState = Record<string, any>;

export interface FormSubmissionResult {
    success: boolean;
    data?: FormState;
    error?: string;
}

export interface FormEvents {
    onStepChange?: (prevStep: number, nextStep: number) => void;
    onSubmit?: (data: FormState) => void;
    onSubmitSuccess?: (result: FormSubmissionResult) => void;
    onSubmitError?: (error: string) => void;
    onFormCancel?: () => void;
    onFinalSubmit?: (data: FormState) => Promise<void>;
}

// Configuration options for the form
export interface FormConfig {
    submitButtonText?: string;
    nextButtonText?: string;
    backButtonText?: string;
    showProgressBar?: boolean;
    allowNavigation?: boolean;
    showStepIndicator?: boolean;
    customClassNames?: {
        form?: string;
        card?: string;
        header?: string;
        content?: string;
        footer?: string;
        button?: string;
    };
}

export interface FormIntegrationProps {
    formId?: string;
    initialData?: FormState;
    events?: FormEvents;
    config?: FormConfig;
    customFormUrl?: string;
} 