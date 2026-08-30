import { Artist, ArtistShort, CreateArtist, UpdateArtist } from "../types/artistTypes";
import { callApi } from "./DataService";

const endpoint = "artists";

export const getArtists = async (): Promise<Artist[]> => {
  const artists = await callApi({ method: "GET", route: endpoint });
  return artists;
};

export const getArtistsShort = async (): Promise<ArtistShort[]> => {
  const artists = await callApi({ method: "GET", route: `${endpoint}/short` });
  return artists;
};

export const getArtist = async (artistId: number): Promise<Artist> => {
  const artist = await callApi({
    method: "GET",
    route: `${endpoint}/${artistId}`,
  });
  return artist;
};

export const createArtist = async (data: CreateArtist): Promise<Artist> => {
  const artist = await callApi({
    method: "POST",
    route: endpoint,
    data,
  });
  return artist;
};

export const updateArtist = async (
  artistId: number,
  data: UpdateArtist,
): Promise<Artist> => {
  const artist = await callApi({
    method: "PATCH",
    route: `${endpoint}/${artistId}`,
    data,
  });
  return artist;
};

export const addUserToArtist = async (
  artistId: number,
  userId: string,
): Promise<Artist> => {
  const artist = await callApi({
    method: "PATCH",
    route: `${endpoint}/${artistId}/users`,
    data: { userId },
  });
  return artist;
};

export const removeUserFromArtist = async (
  artistId: number,
  userId: string,
): Promise<Artist> => {
  const artist = await callApi({
    method: "DELETE",
    route: `${endpoint}/${artistId}/users/${userId}`,
  });
  return artist;
};
