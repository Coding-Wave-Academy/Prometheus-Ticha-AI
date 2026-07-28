"use client";

import React, { useEffect } from "react";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { hapticError } from "@/lib/haptics";

export default function GlobalErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    hapticError();
    console.error("App Route Failure:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FAF7EC]">
      <Card className="max-w-md w-full bg-[#FF9494] text-center space-y-4">
        <div className="w-16 h-16 bg-white border-[3.5px] border-black rounded-2xl flex items-center justify-center mx-auto shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] animate-bounce">
          <svg className="w-9 h-9 text-black fill-current" viewBox="0 0 24 24">
            <path d="M12 2L1 21h22L12 2zm1 14h-2v-2h2v2zm0-4h-2V8h2v4z" />
          </svg>
        </div>

        <h1 className="text-2xl font-black uppercase tracking-tight">
          Application Error
        </h1>
        <p className="text-sm font-bold text-stone-900">
          We encountered an internal processing issue. Please try refreshing or retrying the operation.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Button variant="secondary" onClick={() => reset()}>
            Retry Page
          </Button>
          <Button variant="primary" onClick={() => (window.location.href = "/")}>
            Back to Safety
          </Button>
        </div>
      </Card>
    </div>
  );
}
