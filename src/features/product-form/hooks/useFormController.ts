import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
    FormSchema,
    FormState,
    FormEvents,
} from '../types';
import { FormSchemaType, buildStepValidation } from '../utils/validationUtils';

interface UseFormControllerProps {
    schema: FormSchema;
    events?: FormEvents;
}

export function useFormController({
    schema,
    events = {},
}: UseFormControllerProps) {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);
    const [formData, setFormData] = useState<FormState>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const steps = schema.form_steps;
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

        form.reset(stepData, { keepValues: false, keepDirty: false });
    }, [currentStepIndex, currentStep, form, formData]);

    const validateCurrentStep = async (): Promise<boolean> => {
        const result = await form.trigger();
        return result;
    };

    const next = async () => {
        const isValid = await validateCurrentStep();

        if (!isValid) {
            return;
        }

        if (currentStepIndex < steps.length - 1) {
            const currentValues = form.getValues();
            setFormData(prev => ({ ...prev, ...currentValues }));

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
            const currentValues = form.getValues();
            setFormData(prev => ({ ...prev, ...currentValues }));

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
            next();
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
        back,
        handleCancel,
        onSubmit
    };
} 