"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "../api/api";

export const WithPrivatePage = (Component: React.FC) => {
  const PrivatePage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
      const abortController = new AbortController();
      const checkUser = async () => {
        const isLoggedIn = await api
          .get("/auth/verify-session", { signal: abortController.signal })
          .then(() => true)
          .catch(() => false);
        setIsLoggedIn(isLoggedIn);
        setIsLoading(false);
      };
      checkUser();

      return () => {
        abortController.abort();
      };
    }, []);

    const router = useRouter();

    if (isLoading) {
      return <div>Loading...</div>;
    }

    if (!isLoggedIn) {
      router.push("/login");
      return <div>Redirecting...</div>;
    }

    return Component;
  };

  return PrivatePage;
};
