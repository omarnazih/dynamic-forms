import { useState, useCallback, useMemo } from 'react';
import { FormSchema, FormState, FormSubmissionResult } from '@/features/product-form/types';
import { getFormSchema } from '@/features/product-form/api/api';
import { submitFormData } from '@/features/product-form/services/formService';
import { ERROR_MESSAGES } from '@/config/form.config';

type FormError = {
    message: string;
    code?: string;
};

export const useFormManager = () => {
    const [schema, setSchema] = useState<FormSchema | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<FormError | null>(null);
    const [submissionResult, setSubmissionResult] = useState<FormSubmissionResult | null>(null);
    const [formState, setFormState] = useState<FormState | null>(null);

    const loadFormSchema = useCallback(async () => {
        try {
            setIsLoading(true);
            const formSchema = await getFormSchema();
            setSchema(formSchema);
        } catch (err) {
            setError({
                message: ERROR_MESSAGES.SCHEMA_LOAD_FAILED,
                code: 'SCHEMA_LOAD_ERROR'
            });
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleFormSubmit = useCallback((data: FormState) => {
        setFormState(data);
    }, []);

    const handleFinalSubmit = useCallback(async (data: FormState) => {
        setIsSubmitting(true);
        try {
            const result = await submitFormData(data);
            setSubmissionResult(result);

            if (!result.success && result.error) {
                throw new Error(result.error);
            }
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : ERROR_MESSAGES.UNEXPECTED_ERROR;
            setError({
                message: errorMessage,
                code: 'SUBMISSION_ERROR'
            });
            throw err;
        } finally {
            setIsSubmitting(false);
        }
    }, []);

    const handleReset = useCallback(() => {
        setSubmissionResult(null);
        setError(null);
        setFormState(null);
    }, []);

    const formStatus = useMemo(() => ({
        isLoading,
        isSubmitting,
        hasError: !!error,
        isSubmitted: !!submissionResult?.success
    }), [isLoading, isSubmitting, error, submissionResult]);

    return {
        schema,
        formState,
        error,
        submissionResult,
        formStatus,
        loadFormSchema,
        handleFormSubmit,
        handleFinalSubmit,
        handleReset
    };
}; 