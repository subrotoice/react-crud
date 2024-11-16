import { Platform } from "./Platform";

export interface Game {
  id: number;
  name: string;
  background_image: string;
  description_raw: string;
  parent_platforms: { platform: Platform }[]; // Very Crutial: Design Smale; https://prnt.sc/Mzc4SBafvAjL
  metacritic: number;
  rating_top: number;
  slug: string;
}
