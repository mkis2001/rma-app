import { callApi } from "./DataService";

const endpoint = "users";

type UsernameAvailableResponse = {
  available: boolean;
};

export const UsernameAvailable = async (
  username: string,
): Promise<UsernameAvailableResponse> => {
  const response = await callApi({
    method: "GET",
    route: `${endpoint}/${username}/available`,
  });
  console.log(response);
  return response;
};
