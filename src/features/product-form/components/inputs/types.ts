import { FormInput } from '../../types';
import { UseFormReturn } from 'react-hook-form';
import { FormSchemaType } from '../../utils/validationUtils';

export interface InputComponentProps {
    input: FormInput;
    field: any;
    form?: UseFormReturn<FormSchemaType>;
} 