import { Input } from '@/components/ui/input';
import { InputComponentProps } from './types';

export const DimensionInput = ({ input, field }: InputComponentProps) => (
    <Input
        {...field}
        id={input.input_name}
        placeholder="Length × Width × Height"
        value={field.value || ''}
    />
); 