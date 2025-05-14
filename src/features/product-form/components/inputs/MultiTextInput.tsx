import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { InputComponentProps } from './types';
import { TextInput } from './TextInput';

export const MultiTextInput = ({ input, field, form }: InputComponentProps) => {
    const [newOption, setNewOption] = useState('');
    const options = Array.isArray(field.value) ? field.value : [];

    if (input.input_type !== 'input_selection') {
        return <TextInput input={input} field={field} />;
    }

    const addOption = () => {
        if (newOption.trim() && options.length < input.count) {
            const newOptions = [...options, newOption.trim()];
            field.onChange(newOptions);
            setNewOption('');
        }
    };

    const removeOption = (index: number) => {
        const newOptions = [...options];
        newOptions.splice(index, 1);
        field.onChange(newOptions);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-2 mb-2">
                {options.map((option: string, index: number) => (
                    <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                        <span>{option}</span>
                        <button
                            type="button"
                            onClick={() => removeOption(index)}
                            className="text-red-500 font-bold"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
            <div className="flex gap-2">
                <Input
                    id={`${input.input_name}-new`}
                    value={newOption}
                    onChange={(e) => setNewOption(e.target.value)}
                    placeholder={`Add ${input.label.toLowerCase()}`}
                    disabled={options.length >= input.count}
                />
                <button
                    type="button"
                    onClick={addOption}
                    disabled={!newOption.trim() || options.length >= input.count}
                    className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
                >
                    Add
                </button>
            </div>
            <p className="text-sm text-gray-500">
                {options.length}/{input.count} options
            </p>
        </div>
    );
}; 