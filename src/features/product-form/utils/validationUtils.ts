import { z } from 'zod';
import { FormInput, FormStep, RawInput, SelectionInput, MediaInput } from '../types';

const buildTextValidation = (input: RawInput) => {
    let schema = z.string().trim();

    if (input.max_length) {
        schema = schema.max(input.max_length, {
            message: `${input.label} must be at most ${input.max_length} characters`
        });
    }

    return schema;
};

const buildNumberValidation = (input: RawInput) => {
    return z.coerce.number({
        invalid_type_error: `${input.label} must be a number`
    });
};

const buildDimensionValidation = () => {
    return z.string().trim();
};

const buildRawInputValidation = (input: RawInput) => {
    switch (input.input_format) {
        case 'text':
        case 'textarea':
            return buildTextValidation(input);
        case 'number':
            return buildNumberValidation(input);
        case 'dimension':
            return buildDimensionValidation();
        default:
            return z.any();
    }
};

const buildDropdownValidation = (input: SelectionInput) => {
    if (input.options && input.options.length > 0) {
        return z.enum([input.options[0], ...input.options.slice(1)] as [string, ...string[]], {
            invalid_type_error: `Please select a valid ${input.label}`
        });
    }
    return z.any();
};

const buildMultiTextValidation = (input: SelectionInput) => {
    return z.array(z.string()).max(input.count, {
        message: `You can add up to ${input.count} options`
    });
};

const buildSelectionInputValidation = (input: SelectionInput) => {
    switch (input.input_format) {
        case 'drop':
            return buildDropdownValidation(input);
        case 'multi_text':
            return buildMultiTextValidation(input);
        default:
            return z.any();
    }
};

const buildImagesValidation = () => {
    return z.any().optional();
};

const buildMediaInputValidation = (input: MediaInput) => {
    switch (input.input_format) {
        case 'images':
            return buildImagesValidation();
        default:
            return z.any();
    }
};

export const buildInputValidation = (input: FormInput) => {
    switch (input.input_type) {
        case 'input_raw':
            return buildRawInputValidation(input);
        case 'input_selection':
            return buildSelectionInputValidation(input);
        case 'input_media':
            return buildMediaInputValidation(input);
        default:
            return z.any();
    }
};

export const buildStepValidation = (step: FormStep) => {
    const shape: Record<string, z.ZodTypeAny> = {};

    for (const input of step.inputs) {
        shape[input.input_name] = buildInputValidation(input);
    }

    return z.object(shape);
};

export type FormSchemaType = z.infer<ReturnType<typeof buildStepValidation>>; 