import { ArtistShort } from "../types/artistTypes";
import { callApi } from "./DataService";

const endpoint = "artists";

export const getArtistsShort = async (): Promise<ArtistShort[]> => {
  const artists = await callApi({ method: "GET", route: `${endpoint}/short` });
  return artists;
};
