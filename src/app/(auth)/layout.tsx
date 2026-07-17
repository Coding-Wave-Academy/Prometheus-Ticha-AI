import React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#FAF7EC] flex items-center justify-center p-4 antialiased font-sans selection:bg-[#B6FF00]">
      <div className="w-full max-w-md flex flex-col justify-center min-h-[85vh] py-3 md:py-8 text-black">
        {children}
      </div>
    </div>
  );
}

