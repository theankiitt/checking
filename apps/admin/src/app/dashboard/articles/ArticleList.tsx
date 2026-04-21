"use client";

import { FileText, Edit, Trash2 } from "lucide-react";
import type { Article } from "@/data/mocks/articles";

interface ArticleListProps {
  articles: Article[];
}

export function ArticleList({ articles }: ArticleListProps) {
  return (
    <div className="divide-y divide-gray-200">
      {articles.map((article) => (
        <div
          key={article.id}
          className="p-4 flex items-center justify-between hover:bg-gray-50"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="font-medium text-gray-900">{article.title}</p>
              <p className="text-sm text-gray-500">{article.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                article.status === "Published"
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {article.status}
            </span>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Edit className="w-4 h-4" />
            </button>
            <button className="p-2 text-gray-400 hover:text-red-600">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
