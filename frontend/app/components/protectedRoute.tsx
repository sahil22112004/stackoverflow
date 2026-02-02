'use client';

import { useSelector } from "react-redux";
import { RootState } from "@/app/redux/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useSelector((state: RootState) => state.auth);
  const user = useSelector((state: RootState) => state.auth.currentUser);
  const router = useRouter();

  useEffect(() => {
    if (!isLoggedIn || !user) {
      router.push("/auth/login");
    }
  }, [isLoggedIn]);

  if (!isLoggedIn) return null;

  return <>{children}</>;
}