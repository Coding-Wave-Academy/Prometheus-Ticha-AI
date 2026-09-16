"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import WelcomePage from "@/app/getting-started/page";

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center">
        <div className="w-10 h-10 border-[3.5px] border-black border-t-[#B6FF00] rounded-full animate-spin" />
      </div>
    );
  }

  if (user) {
    return (
      <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center">
        <div className="w-10 h-10 border-[3.5px] border-black border-t-[#B6FF00] rounded-full animate-spin" />
      </div>
    );
  }

  return <WelcomePage />;
}
