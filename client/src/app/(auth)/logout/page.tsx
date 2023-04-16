"use client";
import { api } from "@/lib/api/api";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const logout = async () => {
      await api.post("/auth/logout");
      router.push("/login");
    };
    logout();
  }, [router]);

  return <></>;
}
