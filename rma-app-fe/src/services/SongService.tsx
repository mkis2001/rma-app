import { CreateSong, Song } from "../types/songTypes";
import { callApi } from "./DataService";

const endpoint = "songs";

export const getSongs = async (): Promise<Song[]> => {
  const projects = await callApi({ method: "GET", route: endpoint });
  return projects;
};

export const createSong = async (data: CreateSong) => {
  const project = await callApi({ method: "POST", route: endpoint, data });
  return project;
};
