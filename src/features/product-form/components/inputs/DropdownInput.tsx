import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputComponentProps } from './types';
import { TextInput } from './TextInput';
import { useEffect } from 'react';

export const DropdownInput = ({ input, field, form }: InputComponentProps) => {
    if (input.input_type !== 'input_selection' || !input.options) {
        return <TextInput input={input} field={field} />;
    }

    // Ensure the field value is properly registered with the form
    useEffect(() => {
        if (field.value && form) {
            form.setValue(input.input_name, field.value);
        }
    }, [field.value, form, input.input_name]);

    return (
        <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value || ''}
        >
            <SelectTrigger id={input.input_name}>
                <SelectValue placeholder={`Select ${input.label}`} />
            </SelectTrigger>
            <SelectContent>
                {input.options.map((option) => (
                    <SelectItem key={option} value={option}>
                        {option}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}; 