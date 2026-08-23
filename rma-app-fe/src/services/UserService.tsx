import {
  CreateUser,
  User,
  UsernameAvailableResponse,
} from "../types/userTypes";
import { callApi } from "./DataService";

const endpoint = "users";

export const getUsersByUsername = async (username: string): Promise<User[]> => {
  const users = await callApi({
    method: "GET",
    route: `${endpoint}?username=${username}`,
  });
  return users;
};

export const UsernameAvailable = async (
  username: string,
): Promise<UsernameAvailableResponse> => {
  const response = await callApi({
    method: "GET",
    route: `${endpoint}/${username}/available`,
  });
  return response;
};

export const createUser = async (data: CreateUser): Promise<void> => {
  await callApi({
    method: "POST",
    route: endpoint,
    data,
  });
};
