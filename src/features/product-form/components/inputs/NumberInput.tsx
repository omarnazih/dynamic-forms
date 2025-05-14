import { Input } from '@/components/ui/input';
import { InputComponentProps } from './types';

export const NumberInput = ({ input, field }: InputComponentProps) => (
    <Input
        {...field}
        id={input.input_name}
        type="number"
        value={field.value ?? ''}
        onChange={e => field.onChange(e.target.valueAsNumber || undefined)}
    />
); 