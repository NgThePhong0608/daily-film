import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Movie } from "@/types/movie";
import {
  isValidListingSortValue,
  type ListingSortValue,
} from "@/lib/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parsePageParam(page?: string) {
  const pageNumber = Number(page);

  if (!Number.isInteger(pageNumber) || pageNumber < 1) {
    return 1;
  }

  return pageNumber;
}

export function parseSortParam(sort?: string): ListingSortValue {
  if (!sort || !isValidListingSortValue(sort)) {
    return "latest";
  }

  return sort;
}

export function sortMovies(movies: Movie[], sort: ListingSortValue) {
  const sortedMovies = [...movies];

  switch (sort) {
    case "year-desc":
      return sortedMovies.sort((a, b) => b.year - a.year);
    case "year-asc":
      return sortedMovies.sort((a, b) => a.year - b.year);
    case "az":
      return sortedMovies.sort((a, b) => a.name.localeCompare(b.name, "vi"));
    case "za":
      return sortedMovies.sort((a, b) => b.name.localeCompare(a.name, "vi"));
    case "latest":
    default:
      return sortedMovies;
  }
}
