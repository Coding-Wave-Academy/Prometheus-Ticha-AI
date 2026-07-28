"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import Button from "./Button";
import Card from "./Card";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught Error Boundary Exception:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[60vh] w-full flex items-center justify-center p-4">
          <Card className="max-w-md w-full bg-[#FF9494] text-center space-y-4">
            <div className="w-14 h-14 bg-white border-[3px] border-black rounded-2xl flex items-center justify-center mx-auto shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <svg className="w-8 h-8 text-black fill-current" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
            </div>

            <h2 className="text-2xl font-black uppercase tracking-tight text-black">
              Something went wrong
            </h2>
            <p className="text-sm font-medium text-stone-900">
              An unexpected UI error occurred. Don&apos;t worry, your progress has been safe-guarded.
            </p>
            {this.state.error && (
              <pre className="bg-white border-[2px] border-black rounded-xl p-3 text-xs font-mono text-left overflow-x-auto max-h-32 text-stone-800">
                {this.state.error.message}
              </pre>
            )}
            <div className="pt-2 flex flex-col gap-2 sm:flex-row justify-center">
              <Button variant="secondary" onClick={this.handleReset} className="flex items-center gap-1.5 justify-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.65 6.35A7.958 7.958 0 0012 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0112 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                </svg>
                <span>Try Again</span>
              </Button>
              <Button variant="primary" onClick={() => (window.location.href = "/")} className="flex items-center gap-1.5 justify-center">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                </svg>
                <span>Return Home</span>
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
