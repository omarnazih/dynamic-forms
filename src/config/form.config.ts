export const FORM_CONFIG = {
    submitButtonText: 'Submit',
    nextButtonText: 'Continue',
    backButtonText: 'Previous',
    showProgressBar: true,
    showStepIndicator: true,
    customClassNames: {
        card: 'shadow-lg border-t-4 border-t-blue-500',
        content: 'py-6',
        button: 'px-6'
    }
} as const;

export const ERROR_MESSAGES = {
    SCHEMA_LOAD_FAILED: 'Failed to load form schema. Please try again later.',
    UNEXPECTED_ERROR: 'An unexpected error occurred',
    SUBMISSION_FAILED: 'Form submission failed. Please try again.'
} as const; 