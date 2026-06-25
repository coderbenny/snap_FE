import { Suspense } from 'react';
import { Loader2 } from 'lucide-react';
import JoinForm from './join-form';

export const metadata = { title: 'Join Team' };

export default function JoinPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-sm">
        <Suspense
          fallback={
            <div className="flex justify-center">
              <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
          }
        >
          <JoinForm />
        </Suspense>
      </div>
    </div>
  );
}
