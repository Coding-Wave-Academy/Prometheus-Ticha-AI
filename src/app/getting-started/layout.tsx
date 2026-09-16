import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Started | Ticha AI - Cameroon GCE Exam Prep",
  description:
    "Select your examination track (Ordinary or Advanced Level), choose your struggle subjects, and build your personalized 1% better every day study roadmap.",
};

export default function GettingStartedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen overflow-x-hidden">
      {children}
    </div>
  );
}
