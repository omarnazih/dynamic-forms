import { Card, CardContent } from '@/components/ui/card';

interface ErrorStateProps {
    error: string;
    onReset: () => void;
}

export const ErrorState = ({ error, onReset }: ErrorStateProps) => (
    <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="pt-6">
            <div className="flex justify-center items-center h-64">
                <p className="text-red-500">{error || 'An error occurred.'}</p>
                {error && (
                    <button
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        onClick={onReset}
                    >
                        Try Again
                    </button>
                )}
            </div>
        </CardContent>
    </Card>
); 