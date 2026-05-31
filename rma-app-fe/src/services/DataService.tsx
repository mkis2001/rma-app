type CallApiProps = {
  method: "GET" | "POST" | "PUT" | "DELETE";
  route: string;
  data?: object;
};

const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

export const callApi = async ({ method, route, data }: CallApiProps) => {
  const url = `${BASE_URL}/${route}`;
  console.log(`${method} /${route}`);
  const response = await fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: method !== "GET" ? JSON.stringify(data) : undefined,
  });
  const res = await response.json();
  if (!response.ok) {
    throw new Error(res.message);
  }
  return res;
};
