import AsyncStorage from "@react-native-async-storage/async-storage";
import { File as ExpoFile, Paths } from "expo-file-system";
import { StorageAccessFramework } from "expo-file-system/legacy";
import * as IntentLauncher from "expo-intent-launcher";
import { CreateSong, Song, SongFile } from "../types/songTypes";
import { callApi, callApiUpload } from "./DataService";
import { supabase } from "./Supabase";

const endpoint = "songs";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

// Mime types that can be opened directly with a compatible app.
const OPENABLE_MIME_PREFIXES = ["audio", "video"];
const OPENABLE_MIME_TYPES = ["application/pdf"];

const SAF_DIRECTORY_KEY = "saf_download_directory_uri";

export const getSongs = async (): Promise<Song[]> => {
  const projects = await callApi({ method: "GET", route: endpoint });
  return projects;
};

export const createSong = async (data: CreateSong) => {
  const project = await callApi({ method: "POST", route: endpoint, data });
  return project;
};

export const getSongFiles = async (songId: number): Promise<SongFile[]> => {
  const files = await callApi({
    method: "GET",
    route: `${endpoint}/${songId}/files/`,
  });
  return files;
};

export const uploadSongFile = async (
  songId: number,
  fileUri: string,
  fileName: string,
  mimeType: string,
): Promise<SongFile> => {
  const file = await callApiUpload(
    `${endpoint}/${songId}/files/`,
    fileUri,
    fileName,
    mimeType,
  );
  return file;
};

export const deleteSongFile = async (
  songId: number,
  fileId: number,
): Promise<SongFile> => {
  const file = await callApi({
    method: "DELETE",
    route: `${endpoint}/${songId}/files/${fileId}`,
  });
  return file;
};

const isOpenable = (mimeType: string): boolean => {
  const prefix = mimeType.split("/")[0];
  return (
    OPENABLE_MIME_PREFIXES.includes(prefix) ||
    OPENABLE_MIME_TYPES.includes(mimeType)
  );
};

const downloadToCache = async (songId: number, file: SongFile) => {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    throw new Error("User not authenticated");
  }

  const url = `${BASE_URL}/${endpoint}/${songId}/files/${file.id}`;

  return ExpoFile.downloadFileAsync(url, new ExpoFile(Paths.cache, file.name), {
    headers: {
      Authorization: `Bearer ${session.access_token}`,
    },
    idempotent: true,
  });
};

const getSafDirectoryUri = async (): Promise<string | null> => {
  const cachedUri = await AsyncStorage.getItem(SAF_DIRECTORY_KEY);
  if (cachedUri) {
    return cachedUri;
  }

  const permissions =
    await StorageAccessFramework.requestDirectoryPermissionsAsync();
  if (!permissions.granted) {
    return null;
  }

  await AsyncStorage.setItem(SAF_DIRECTORY_KEY, permissions.directoryUri);
  return permissions.directoryUri;
};

const saveToDevice = async (
  downloadedFile: Awaited<ReturnType<typeof downloadToCache>>,
  file: SongFile,
): Promise<void> => {
  const directoryUri = await getSafDirectoryUri();
  if (!directoryUri) {
    throw new Error("Storage permission not granted");
  }

  const base64 = await downloadedFile.base64();

  const safFileUri = await StorageAccessFramework.createFileAsync(
    directoryUri,
    file.name,
    file.mimeType,
  );

  await StorageAccessFramework.writeAsStringAsync(safFileUri, base64, {
    encoding: "base64",
  });
};

export const downloadSongFile = async (
  songId: number,
  file: SongFile,
): Promise<void> => {
  const downloadedFile = await downloadToCache(songId, file);

  if (isOpenable(file.mimeType)) {
    await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
      data: downloadedFile.contentUri,
      type: file.mimeType,
      flags: 1,
    });
  } else {
    await saveToDevice(downloadedFile, file);
  }
};
