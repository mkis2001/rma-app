import { User } from "./userTypes";

export type ArtistShort = {
  id: number;
  name: string;
};

export type Artist = {
  id: number;
  name: string;
  description: string;
  users: User[];
};

export type CreateArtist = {
  name: string;
  description?: string;
};

export type UpdateArtist = {
  name?: string;
  description?: string;
};
