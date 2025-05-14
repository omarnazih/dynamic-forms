'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FormRenderer } from '@/features/product-form';
import { getFormSchema } from '@/features/product-form/api/api';
import { FormSchema, FormState, FormSubmissionResult, FormConfig } from '@/features/product-form/types';
import { submitFormData } from '@/features/product-form/services/formService';

export default function Home() {
  const [formSchema, setFormSchema] = useState<FormSchema | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submissionResult, setSubmissionResult] = useState<FormSubmissionResult | null>(null);

  useEffect(() => {
    const loadFormDataAsync = async () => {
      try {
        setIsLoading(true);
        // Load form schema
        const schema = await getFormSchema();
        setFormSchema(schema);
      } catch (err) {
        setError('Failed to load form schema. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadFormDataAsync();
  }, []);

  const handleFormSubmit = (data: FormState) => {
    console.log('Form data updated:', data);
    setFormData(data);
  };

  const handleFinalSubmit = async (data: FormState) => {
    console.log('Final form submission:', data);
    const result = await submitFormData(data);
    setSubmissionResult(result);

    if (!result.success && result.error) {
      throw new Error(result.error);
    }

    return;
  };

  const handleSubmitSuccess = (result: FormSubmissionResult) => {
    console.log('Form submitted successfully:', result);
  };

  const handleSubmitError = (error: string) => {
    console.error('Form submission error:', error);
    setError(error);
  };


  // Form configuration
  const formConfig: FormConfig = {
    submitButtonText: 'Submit Product',
    nextButtonText: 'Continue',
    backButtonText: 'Previous',
    showProgressBar: true,
    showStepIndicator: true,
    customClassNames: {
      card: 'shadow-lg border-t-4 border-t-blue-500',
      content: 'py-6',
      button: 'px-6'
    }
  };

  return (
    <main className="min-h-screen p-6 md:p-12 bg-gray-50 ">
      <div className="max-w-5xl mx-auto">
        {isLoading && (
          <Card className="w-full max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <div className="flex justify-center items-center h-64">
                <p>Loading form...</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoading && (error || !formSchema) && (
          <Card className="w-full max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <div className="flex justify-center items-center h-64">
                <p className="text-red-500">{error || 'An error occurred.'}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {!isLoading && !error && formSchema && !submissionResult && (
          <FormRenderer
            formSchema={formSchema}
            initialData={formData}
            events={{
              onSubmit: handleFormSubmit,
              onFinalSubmit: handleFinalSubmit,
              onSubmitError: handleSubmitError,
              onSubmitSuccess: handleSubmitSuccess,
            }}
            config={formConfig}
            formId="product-form"
          />
        )}

        {submissionResult && submissionResult.success && (
          <Card className="w-full max-w-3xl mx-auto">
            <CardContent className="pt-6">
              <div className="flex flex-col justify-center items-center h-64">
                <h2 className="text-2xl font-bold text-green-600 mb-4">Form Submitted Successfully!</h2>
                <p>Thank you for your submission.</p>
                <button
                  className="mt-6 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => {
                    setSubmissionResult(null);
                    setFormData({});
                  }}
                >
                  Submit Another Product
                </button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}
