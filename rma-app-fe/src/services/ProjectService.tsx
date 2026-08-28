import {
  CreateProject,
  Project,
  ProjectShort,
  ProjectType,
} from "../types/projectTypes";
import { SongShort } from "../types/songTypes";
import { callApi, callApiBinary, callApiUpload } from "./DataService";

const endpoint = "projects";

export const getProjects = async (): Promise<Project[]> => {
  const projects = await callApi({ method: "GET", route: endpoint });
  return projects;
};

export const getProjectsShort = async (): Promise<ProjectShort[]> => {
  const projects = await callApi({ method: "GET", route: `${endpoint}/short` });
  return projects;
};

export const getProjectTypes = async (): Promise<ProjectType[]> => {
  const projectTypes = await callApi({
    method: "GET",
    route: `${endpoint}/types`,
  });
  return projectTypes;
};

export const getProjectSongs = async (id: number): Promise<SongShort[]> => {
  const songs = await callApi({
    method: "GET",
    route: `${endpoint}/${id}/songs`,
  });
  return songs;
};

export const getProjectImage = async (
  id: number,
): Promise<string | null> => {
  const imageUrl = await callApiBinary(`${endpoint}/${id}/image`);
  return imageUrl;
};

export const createProject = async (data: CreateProject) => {
  const project = await callApi({ method: "POST", route: endpoint, data });
  return project;
};

export const uploadProjectImage = async (
  id: number,
  fileUri: string,
  fileName: string,
  mimeType: string,
): Promise<Project> => {
  const project = await callApiUpload(
    `${endpoint}/${id}/image`,
    fileUri,
    fileName,
    mimeType,
  );
  return project;
};

export const deleteProjectImage = async (id: number): Promise<Project> => {
  const project = await callApi({
    method: "DELETE",
    route: `${endpoint}/${id}/image`,
  });
  return project;
};
