import {
  ErrorResponse,
  Photos,
  PhotosWithTotalResults,
  Photo,
} from "./../../node_modules/pexels/dist/types.d";
import { createClient } from "pexels";
import { config } from "../config/config";

const pexelsClient = createClient(config.PEXELS_KEY);

const cleanResponse = (
  response: Photos | ErrorResponse | PhotosWithTotalResults | any
) => {
  if (response.hasOwnProperty("error")) return response;
  const { page, per_page, photos, total_results } = response;
  return {
    page,
    per_page,
    total_results,
    photos: photos.map((el: Photo) => ({
      id: el.id,
      imageUrl: el.src.original,
      title: el.photographer,
      description: el.alt,
    })),
  };
};

export const getCardsList = async (page: number, per_page: number) => {
  const photos = await pexelsClient.photos.curated({
    page,
    per_page,
  });
  return cleanResponse(photos);
};

export const searchCards = async (
  query: string,
  page: number,
  per_page: number
) => {
  const search = await pexelsClient.photos.search({
    query,
    page,
    per_page,
  });
  return cleanResponse(search);
};
