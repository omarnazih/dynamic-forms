import { FormSchema } from '../types';

export const getFormSchema = async (): Promise<FormSchema> => {
    try {
        const response = await fetch('/assignement_form.json');
        if (!response.ok) {
            throw new Error('Failed to load form schema');
        }
        return await response.json();
    } catch (error) {
        console.error('Error loading form schema:', error);
        throw error;
    }
};