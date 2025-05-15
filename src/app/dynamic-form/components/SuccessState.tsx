import { Card, CardContent } from '@/components/ui/card';

interface SuccessStateProps {
    onReset: () => void;
}

export const SuccessState = ({ onReset }: SuccessStateProps) => (
    <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="pt-6">
            <div className="flex flex-col justify-center items-center h-64">
                <h2 className="text-2xl font-bold text-green-600 mb-4">Form Submitted Successfully!</h2>
                <p>Thank you for your submission.</p>
                <button
                    className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    onClick={onReset}
                >
                    Submit Another Product
                </button>
            </div>
        </CardContent>
    </Card>
); 