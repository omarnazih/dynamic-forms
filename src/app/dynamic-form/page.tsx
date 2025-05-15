'use client';

import { useEffect } from 'react';
import { FormRenderer } from '@/features/product-form';
import { FormSubmissionResult } from '@/features/product-form/types';
import { LoadingState } from '@/app/dynamic-form/components/LoadingState';
import { ErrorState } from '@/app/dynamic-form/components/ErrorState';
import { SuccessState } from '@/app/dynamic-form/components/SuccessState';
import { useFormManager } from '@/features/product-form/hooks/useFormManager';
import { FORM_CONFIG } from '@/config/form.config';

export default function DynamicFormPage() {
    const {
        schema,
        error,
        submissionResult,
        formStatus,
        loadFormSchema,
        handleFormSubmit,
        handleFinalSubmit,
        handleReset
    } = useFormManager();

    useEffect(() => {
        loadFormSchema();
    }, [loadFormSchema]);

    const handleSubmitSuccess = (result: FormSubmissionResult) => {
        console.log('Form submitted successfully:', result);
    };

    const handleSubmitError = (error: string) => {
        console.error('Form submission error:', error);
    };

    return (
        <main className="min-h-screen p-6 md:p-12 bg-gray-50">
            <div className="max-w-5xl mx-auto">
                {formStatus.isLoading && <LoadingState />}
                {!formStatus.isLoading && error && <ErrorState error={error.message} onReset={handleReset} />}
                {!formStatus.isLoading && !error && schema && !submissionResult && (
                    <FormRenderer
                        schema={schema}
                        events={{
                            onSubmit: handleFormSubmit,
                            onFinalSubmit: handleFinalSubmit,
                            onSubmitError: handleSubmitError,
                            onSubmitSuccess: handleSubmitSuccess
                        }}
                        config={FORM_CONFIG}
                        formId="product-form"
                    />
                )}
                {submissionResult?.success && <SuccessState onReset={handleReset} />}
            </div>
        </main>
    );
} 