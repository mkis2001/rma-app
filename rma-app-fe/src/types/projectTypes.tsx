import { ArtistShort } from "./artistTypes";

export interface ProjectType {
  id: number;
  name: string;
}
export interface Project {
  id: number;
  name: string;
  type: ProjectType;
  description: string;
  artist: ArtistShort;
}

export interface ProjectShort {
  id: number;
  name: string;
}

export interface CreateProject {
  name: string;
  typeId: number;
  description?: string;
  artistId: number;
}
