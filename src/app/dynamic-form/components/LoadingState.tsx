import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

export const LoadingState = () => (
    <Card className="w-full max-w-3xl mx-auto">
        <CardContent className="pt-6">
            <div className="flex justify-center items-center h-64">
                <Loader2 className="h-8 w-8 animate-spin" />
            </div>
        </CardContent>
    </Card>
); 