import { ArtistShort } from "./artistTypes";

export type ProjectType = {
  id: number;
  name: string;
};
export type Project = {
  id: number;
  name: string;
  type: ProjectType;
  description: string;
  artist: ArtistShort;
};

export type ProjectShort = {
  id: number;
  name: string;
};

export type CreateProject = {
  name: string;
  typeId: number;
  description?: string;
  artistId: number;
};

export type UpdateProject = {
  name?: string;
  typeId?: number;
  description?: string;
  artistId?: number;
};
