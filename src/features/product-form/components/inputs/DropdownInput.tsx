import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { InputComponentProps } from './types';
import { TextInput } from './TextInput';

export const DropdownInput = ({ input, field }: InputComponentProps) => {
    if (input.input_type !== 'input_selection' || !input.options) {
        return <TextInput input={input} field={field} />;
    }

    return (
        <Select
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value}
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