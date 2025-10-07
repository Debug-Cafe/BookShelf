
export type ReadingStatus = "QUERO_LER" | "LENDO" | "LIDO";

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  year: number;
  pages: number;
  pagesread?: number | null;
  status: ReadingStatus; // Agora usa o tipo definido acima
  finishDate?: Date | string | null;
  rating?: number | null;
  synopsis?: string | null;
  cover?: string | null;
  imageurl?: string | null;
  created_at?: Date | string | null;
  owner: string | null;
}

export const allReadingStatuses: ReadingStatus[] = [
  "QUERO_LER",
  "LENDO",
  "LIDO",
];

export const statusLabels: Record<ReadingStatus, string> = {
  QUERO_LER: "Quero Ler",
  LENDO: "Lendo",
  LIDO: "Lido",
};
