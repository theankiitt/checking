export interface Article {
  id: string;
  title: string;
  status: "Published" | "Draft";
  date: string;
}

export const ARTICLES_MOCK: Article[] = [
  {
    id: "1",
    title: "Getting Started with GharSamma",
    status: "Published",
    date: "2024-01-15",
  },
  {
    id: "2",
    title: "How to Care for Your Pashmina",
    status: "Draft",
    date: "2024-01-14",
  },
  {
    id: "3",
    title: "The Art of Nepali Handicrafts",
    status: "Published",
    date: "2024-01-13",
  },
];
