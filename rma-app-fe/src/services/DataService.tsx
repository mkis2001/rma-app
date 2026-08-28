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

export const callApiBinary = async (route: string): Promise<string | null> => {
  const url = `${BASE_URL}/${route}`;
  console.log(`GET /${route} (binary)`);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("User not authenticated");
  }

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Failed to fetch binary data");
  }

  const blob = await response.blob();
  const reader = new FileReader();
  return new Promise((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result as string);
    };
    reader.readAsDataURL(blob);
  });
};

export const callApiUpload = async (
  route: string,
  fileUri: string,
  fileName: string,
  mimeType: string,
): Promise<any> => {
  const url = `${BASE_URL}/${route}`;
  console.log(`POST /${route} (upload)`);

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("User not authenticated");
  }

  const formData = new FormData();
  formData.append("file", {
    uri: fileUri,
    name: fileName,
    type: mimeType,
  } as any);

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    body: formData,
  });

  const res = await response.json();
  if (!response.ok) {
    throw new Error(res.message);
  }

  return res;
};
