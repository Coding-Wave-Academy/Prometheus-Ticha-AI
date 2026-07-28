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
            <div className="text-4xl">💥</div>
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
              <Button variant="secondary" onClick={this.handleReset}>
                Try Again 🔄
              </Button>
              <Button variant="primary" onClick={() => window.location.assign("/")}>
                Return Home 🏠
              </Button>
            </div>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
