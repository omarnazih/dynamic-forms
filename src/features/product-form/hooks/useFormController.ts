import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FormSchema,
    FormState,
    FormEvents,
} from '../types';
import { FormSchemaType, buildStepValidation } from '../utils/validationUtils';
import { submitFormData } from '../services/formService';

interface UseFormControllerProps {
    formSchema: FormSchema;
    events?: FormEvents;
}

export function useFormController({
    formSchema,
    events = {},
}: UseFormControllerProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [formData, setFormData] = useState<FormState>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const steps = formSchema.form_steps;
    const currentStep = steps[currentStepIndex];
    const isFirstStep = currentStepIndex === 0;
    const isLastStep = currentStepIndex === steps.length - 1;
    const progress = ((currentStepIndex + 1) / steps.length) * 100;

    const currentStepSchema = buildStepValidation(currentStep);

    const form = useForm<FormSchemaType>({
        resolver: zodResolver(currentStepSchema),
        defaultValues: formData,
        mode: 'onChange'
    });

    useEffect(() => {
        const stepFields = currentStep.inputs.map(input => input.input_name);
        const stepData = Object.fromEntries(
            Object.entries(formData).filter(([key]) => stepFields.includes(key))
        );

        form.reset(stepData);
    }, [currentStepIndex, currentStep, form, formData]);

    const next = () => {
        if (currentStepIndex < steps.length - 1) {
            const prevStep = currentStepIndex;
            const nextStep = currentStepIndex + 1;

            setCurrentStepIndex(nextStep);

            if (events.onStepChange) {
                events.onStepChange(prevStep, nextStep);
            }
        }
    };

    const back = () => {
        if (currentStepIndex > 0) {
            const prevStep = currentStepIndex;
            const nextStep = currentStepIndex - 1;

            setCurrentStepIndex(nextStep);

            if (events.onStepChange) {
                events.onStepChange(prevStep, nextStep);
            }
        }
    };

    const handleCancel = () => {
        if (events.onFormCancel) {
            events.onFormCancel();
        }
    };

    const onSubmit = async (data: FormSchemaType) => {
        const updatedFormData = { ...formData, ...data };
        setFormData(updatedFormData);

        if (events.onSubmit) {
            events.onSubmit(updatedFormData);
        }

        if (isLastStep) {
            await handleFinalSubmit(updatedFormData);
        } else {
            next();
        }
    };

    const handleFinalSubmit = async (formData: FormState) => {
        try {
            setIsSubmitting(true);

            const result = await submitFormData(formData, ` `);

            if (result.success) {
                if (events.onSubmitSuccess) {
                    events.onSubmitSuccess(result);
                } else {
                    alert('Form submitted successfully!');
                }
            } else {
                if (events.onSubmitError && result.error) {
                    events.onSubmitError(result.error);
                } else {
                    alert(`Form submission failed: ${result.error}`);
                }
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

            if (events.onSubmitError) {
                events.onSubmitError(errorMessage);
            } else {
                alert('An unexpected error occurred while submitting the form.');
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        form,
        formData,
        currentStep,
        currentStepIndex,
        isFirstStep,
        isLastStep,
        progress,
        isSubmitting,
        next,
        back,
        handleCancel,
        onSubmit
    };
} 