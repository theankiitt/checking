"use client";

import { useQuery } from "@tanstack/react-query";
import TopBannerClient from "./TopBannerClient";
import { getAllBanners } from "./types";

export default function TopBanner() {
  const {
    data: banners = [],
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["banners"],
    queryFn: getAllBanners,
    staleTime: 5 * 60 * 1000,
    refetchOnMount: true,
  });

  if (isLoading || isError || !banners || banners.length === 0) {
    return null;
  }

  return <TopBannerClient banners={banners} />;
}
