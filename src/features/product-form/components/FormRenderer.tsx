'use client';

import { Card, CardContent } from '@/components/ui/card';
import { FormSchema, FormEvents, FormConfig } from '../types';
import { FormStep } from './FormStep';
import { FormHeader } from './FormHeader';
import { FormFooter } from './FormFooter';
import { cn } from '@/lib/utils';
import { useFormController } from '../hooks/useFormController';

interface FormRendererProps {
    schema: FormSchema;
    events?: FormEvents;
    config?: FormConfig;
    formId?: string;
}

export const FormRenderer = ({
    schema,
    events = {},
    config = {},
    formId
}: FormRendererProps) => {
    const {
        form,
        currentStep,
        currentStepIndex,
        isFirstStep,
        isLastStep,
        progress,
        isSubmitting,
        back,
        handleCancel,
        onSubmit
    } = useFormController({
        schema,
        events
    });

    const {
        submitButtonText = 'Submit',
        nextButtonText = 'Next',
        backButtonText = 'Back',
        showProgressBar = true,
        showStepIndicator = true,
        customClassNames = {}
    } = config;

    return (
        <Card className={cn("w-full max-w-3xl mx-auto", customClassNames.card)}>
            <FormHeader
                formName={schema.form_name}
                currentStep={currentStepIndex}
                totalSteps={schema.form_steps.length}
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