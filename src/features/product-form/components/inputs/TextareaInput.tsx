import { Textarea } from '@/components/ui/textarea';
import { InputComponentProps } from './types';

export const TextareaInput = ({ input, field }: InputComponentProps) => (
    <Textarea
        {...field}
        id={input.input_name}
        maxLength={(input.input_type === 'input_raw' && input.max_length) || undefined}
        value={field.value || ''}
    />
); 