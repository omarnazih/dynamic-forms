import { CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface FormHeaderProps {
    formName: string;
    currentStep: number;
    totalSteps: number;
    progress: number;
    showProgressBar?: boolean;
    showStepIndicator?: boolean;
    className?: string;
}

export const FormHeader = ({
    formName,
    currentStep,
    totalSteps,
    progress,
    showProgressBar = true,
    showStepIndicator = true,
    className
}: FormHeaderProps) => {
    return (
        <CardHeader className={cn(className)}>
            <CardTitle className="text-center">
                {formName.replace(/_/g, ' ')}
            </CardTitle>
            {showProgressBar && (
                <div className="mt-2">
                    <Progress value={progress} className="h-2" />
                    {showStepIndicator && (
                        <p className="text-right text-sm text-gray-500 mt-1">
                            Step {currentStep + 1} of {totalSteps}
                        </p>
                    )}
                </div>
            )}
        </CardHeader>
    );
}; 