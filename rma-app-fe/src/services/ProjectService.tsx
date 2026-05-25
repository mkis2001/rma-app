import { callApi } from "./DataService";

interface ProjectType {
  id: number;
  name: "Album" | "EP" | "Demo" | "Split" | "Single";
}
export interface Project {
  id: number;
  name: string;
  type: ProjectType;
  description: string;
}

export const getProjects = async (): Promise<Project[]> => {
  const projects = await callApi({ method: "GET", route: "project" });
  return projects;
};
