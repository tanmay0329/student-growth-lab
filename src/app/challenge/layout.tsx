import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Assessment Challenge",
  description: "Engage in the Student Growth Lab behavioral intelligence simulation.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function ChallengeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
