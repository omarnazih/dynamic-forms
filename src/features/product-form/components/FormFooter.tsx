import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface FormFooterProps {
    isFirstStep: boolean;
    isLastStep: boolean;
    onBack: () => void;
    onCancel?: () => void;
    isSubmitting?: boolean;
    backButtonText?: string;
    nextButtonText?: string;
    submitButtonText?: string;
    showCancelButton?: boolean;
    className?: string;
    buttonClassName?: string;
}

export const FormFooter = ({
    isFirstStep,
    isLastStep,
    onBack,
    onCancel,
    isSubmitting = false,
    backButtonText = 'Back',
    nextButtonText = 'Next',
    submitButtonText = 'Submit',
    showCancelButton = false,
    className,
    buttonClassName
}: FormFooterProps) => {
    return (
        <CardFooter className={cn("flex justify-between items-center gap-4 mt-4", className)}>
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    onClick={onBack}
                    disabled={isFirstStep || isSubmitting}
                    className={buttonClassName}
                >
                    {backButtonText}
                </Button>

                {showCancelButton && (
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className={buttonClassName}
                    >
                        Cancel
                    </Button>
                )}
            </div>

            <Button
                type="submit"
                disabled={isSubmitting}
                className={buttonClassName}
            >
                {isSubmitting
                    ? (isLastStep ? 'Submitting...' : 'Saving...')
                    : (isLastStep ? submitButtonText : nextButtonText)
                }
            </Button>
        </CardFooter>
    );
}; 