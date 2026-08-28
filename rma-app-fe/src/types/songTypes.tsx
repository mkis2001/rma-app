type SongProject = {
  id: number;
  name: string;
};

export type Song = {
  id: number;
  name: string;
  lyrics: string;
  project: SongProject;
};

export type SongShort = {
  id: number;
  name: string;
};

export type CreateSong = {
  name: string;
  lyrics: string;
  projectId: number;
};

export type SongFile = {
  id: number;
  name: string;
  songId: number;
  path: string;
  mimeType: string;
};
