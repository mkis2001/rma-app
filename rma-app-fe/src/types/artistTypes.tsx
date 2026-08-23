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
