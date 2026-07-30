"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DailyQuizRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/daily-quiz");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center">
      <div className="w-10 h-10 border-[3.5px] border-black border-t-[#B6FF00] rounded-full animate-spin" />
    </div>
  );
}
