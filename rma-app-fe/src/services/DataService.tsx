import { supabase } from "./Supabase";

type CallApiProps = {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  route: string;
  data?: object;
};

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const callApi = async ({ method, route, data }: CallApiProps) => {
  const url = `${BASE_URL}/${route}`;
  console.log(`${method} /${route}`);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${session.access_token}`,
    },
    body: method !== "GET" ? JSON.stringify(data) : undefined,
  });
  const res = await response.json();
  if (!response.ok) {
    throw new Error(res.message);
  }
  return res;
};
