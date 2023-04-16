import useSWR from "swr";
import { api } from "../api/api";

//fetch if user is logged in, the api response 204 if user is logged in, returns boolean
const fetcher = (url: string) =>
  api
    .get(url)
    .then(() => true)
    .catch(() => false);

export const useIsUserLogged = () => {
  const { data, error, mutate } = useSWR("/auth/verify-session", fetcher);
  const isLoading = !data && !error;
  const isLoggedIn = data;

  return {
    isLoading,
    isLoggedIn,
    mutate,
  };
};
