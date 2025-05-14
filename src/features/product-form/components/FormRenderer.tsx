'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormSchema, FormState, FormEvents, FormConfig } from '../types';
import { FormStep } from './FormStep';
import { useForm } from 'react-hook-form';
import { FormSchemaType, buildStepValidation } from '../utils/validationUtils';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormHeader } from './FormHeader';
import { FormFooter } from './FormFooter';
import { cn } from '@/lib/utils';

interface FormRendererProps {
    formSchema: FormSchema;
    initialData?: FormState;
    events?: FormEvents;
    config?: FormConfig;
    customFormUrl?: string;
    formId?: string;
}

export const FormRenderer = ({
    formSchema,
    initialData = {},
    events = {},
    config = {},
    customFormUrl,
    formId
}: FormRendererProps) => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [formData, setFormData] = useState<FormState>(initialData);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Update form data when initialData changes
    useEffect(() => {
        if (Object.keys(initialData).length > 0) {
            setFormData(initialData);
        }
    }, [initialData]);

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

        // Always notify parent of form data changes
        if (events.onSubmit) {
            events.onSubmit(updatedFormData);
        }

        if (isLastStep) {
            // Final submission
            if (events.onFinalSubmit) {
                setIsSubmitting(true);
                try {
                    await events.onFinalSubmit(updatedFormData);
                } catch (error) {
                    console.error('Error during form submission:', error);
                    const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

                    if (events.onSubmitError) {
                        events.onSubmitError(errorMessage);
                    }
                } finally {
                    setIsSubmitting(false);
                }
            }
        } else {
            // Move to next step
            next();
        }
    };

    // Extract configuration options
    const {
        submitButtonText = 'Submit',
        nextButtonText = 'Next',
        backButtonText = 'Back',
        showProgressBar = true,
        showStepIndicator = true,
        allowNavigation = true,
        customClassNames = {}
    } = config;

    return (
        <Card className={cn("w-full max-w-3xl mx-auto", customClassNames.card)}>
            <FormHeader
                formName={formSchema.form_name}
                currentStep={currentStepIndex}
                totalSteps={steps.length}
                progress={progress}
                showProgressBar={showProgressBar}
                showStepIndicator={showStepIndicator}
                className={customClassNames.header}
            />
            <form onSubmit={form.handleSubmit(onSubmit)} className={customClassNames.form} id={formId}>
                <CardContent className={customClassNames.content}>
                    <FormStep step={currentStep} form={form} />
                </CardContent>
                <FormFooter
                    isFirstStep={isFirstStep}
                    isLastStep={isLastStep}
                    onBack={back}
                    onCancel={handleCancel}
                    isSubmitting={isSubmitting}
                    backButtonText={backButtonText}
                    nextButtonText={nextButtonText}
                    submitButtonText={submitButtonText}
                    showCancelButton={!!events.onFormCancel}
                    className={customClassNames.footer}
                    buttonClassName={customClassNames.button}
                />
            </form>
        </Card>
    );
}; 