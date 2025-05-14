import { Input } from '@/components/ui/input';
import { InputComponentProps } from './types';

export const TextInput = ({ input, field }: InputComponentProps) => (
    <Input
        {...field}
        id={input.input_name}
        maxLength={(input.input_type === 'input_raw' && input.max_length) || undefined}
        value={field.value || ''}
    />
); 