import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { InputComponentProps } from './types';
import { TextInput } from './TextInput';

export const ImageInput = ({ input, field }: InputComponentProps) => {
    const [preview, setPreview] = useState<string[]>([]);
    const files = Array.isArray(field.value) ? field.value : [];

    if (input.input_type !== 'input_media') {
        return <TextInput input={input} field={field} />;
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files);

            if (files.length + newFiles.length > input.max_count) {
                alert(`Maximum ${input.max_count} files allowed`);
                return;
            }

            newFiles.forEach(file => {
                const reader = new FileReader();
                reader.onload = (e) => {
                    if (e.target?.result) {
                        setPreview(prev => [...prev, e.target!.result as string]);
                    }
                };
                reader.readAsDataURL(file);
            });

            field.onChange([...files, ...newFiles]);
        }
    };

    const removeFile = (index: number) => {
        const newFiles = [...files];
        newFiles.splice(index, 1);
        field.onChange(newFiles);

        const newPreviews = [...preview];
        newPreviews.splice(index, 1);
        setPreview(newPreviews);
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-wrap gap-4 mb-4">
                {preview.map((src, index) => (
                    <div key={index} className="relative w-24 h-24">
                        <img src={src} alt={`Preview ${index}`} className="w-full h-full object-cover rounded" />
                        <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                        >
                            ×
                        </button>
                    </div>
                ))}
            </div>
            <Input
                id={input.input_name}
                type="file"
                accept={input.accepted_formats.map(format => `.${format}`).join(',')}
                onChange={handleFileChange}
                disabled={files.length >= input.max_count}
                multiple={input.max_count > 1}
            />
            <p className="text-sm text-gray-500">
                Accepted formats: {input.accepted_formats.join(', ')}
            </p>
            <p className="text-sm text-gray-500">
                {files.length}/{input.max_count} files
            </p>
        </div>
    );
}; 