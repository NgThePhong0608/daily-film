"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function UsernameGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const username = localStorage.getItem("username");

    if (!username) {
      // Redirect to welcome
      router.push("/welcome");
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthorized(true);
    }
  }, [router]);

  // Always render children to enable bot crawling / SEO
  // The effect will handle the redirect if needed for users
  return <>{children}</>;
}
