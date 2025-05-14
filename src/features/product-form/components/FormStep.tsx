import { FormStep as FormStepType } from '../types';
import { DynamicInput } from './DynamicInput';
import { formatName } from '../utils/formUtils';
import { UseFormReturn } from 'react-hook-form';
import { FormSchemaType } from '../utils/validationUtils';
import { Form } from '@/components/ui/form';

interface FormStepProps {
    step: FormStepType;
    form: UseFormReturn<FormSchemaType>;
}

export const FormStep = ({ step, form }: FormStepProps) => {
    const sortedInputs = [...step.inputs].sort((a, b) => a.order - b.order);

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">{formatName(step.step_name)}</h2>
            <Form {...form}>
                <div className="space-y-6">
                    {sortedInputs.map((input) => (
                        <DynamicInput
                            key={input.input_name}
                            input={input}
                            form={form}
                        />
                    ))}
                </div>
            </Form>
        </div>
    );
}; 