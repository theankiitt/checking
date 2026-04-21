"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import { PageHeader } from "@/components/ui/PageHeader";
import { Button } from "@/components/ui/button";
import { SkeletonTable } from "@/components/ui/Skeleton";
import { ArticleList } from "./ArticleList";
import { ARTICLES_MOCK } from "@/data/mocks/articles";

export default function ArticlesPage() {
  const [loading] = useState(false);
  const [articles] = useState(ARTICLES_MOCK);

  return (
    <DashboardLayout title="Articles">
      <PageHeader
        title="Articles"
        description="Create and manage blog articles"
        action={
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Article
          </Button>
        }
      />

      {loading ? (
        <SkeletonTable rows={5} />
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <ArticleList articles={articles} />
        </div>
      )}
    </DashboardLayout>
  );
}
