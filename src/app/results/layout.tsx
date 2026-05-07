import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assessment Results",
  description: "View your AI-powered behavioral analysis results and operational DNA archetype.",
  robots: {
    index: false, // Don't index individual result pages to avoid thin content/duplicate issues
    follow: true,
  },
};

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
