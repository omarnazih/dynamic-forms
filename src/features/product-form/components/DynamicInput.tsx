import { FormField, FormItem, FormControl, FormMessage, FormLabel } from '@/components/ui/form';
import { FormInput } from '../types';
import { UseFormReturn } from 'react-hook-form';
import { FormSchemaType } from '../utils/validationUtils';
import {
    TextInput,
    TextareaInput,
    NumberInput,
    DimensionInput,
    DropdownInput,
    MultiTextInput,
    ImageInput
} from './inputs';

interface DynamicInputProps {
    input: FormInput;
    form: UseFormReturn<FormSchemaType>;
}

export const DynamicInput = ({ input, form }: DynamicInputProps) => {
    const inputComponents = {
        text: TextInput,
        textarea: TextareaInput,
        number: NumberInput,
        dimension: DimensionInput,
        drop: DropdownInput,
        multi_text: MultiTextInput,
        images: ImageInput
    };

    const InputComponent = inputComponents[input.input_format] || TextInput;

    return (
        <FormField
            control={form.control}
            name={input.input_name}
            render={({ field }) => (
                <FormItem>
                    <FormLabel>{input.label}</FormLabel>
                    <FormControl>
                        <InputComponent input={input} field={field} form={form} />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}; 