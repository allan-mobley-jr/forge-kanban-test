export interface Card {
  id: string;
  title: string;
  description?: string;
  labels: string[];
  createdAt: string;
}

export interface Column {
  id: string;
  title: string;
  cardIds: string[];
}

export interface Board {
  version: number;
  columns: Column[];
  cards: Record<string, Card>;
}
