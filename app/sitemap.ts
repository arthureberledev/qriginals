import type { MetadataRoute } from "next";

import { getCreations } from "~/lib/server/supabase-anon";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const creations = await getCreations();
  const creationUrls =
    creations?.map((creation) => ({
      url: `https://qriginals.com/creations/${creation.id}`,
      lastModified: new Date(creation.created_at),
    })) ?? [];

  return [
    {
      url: "https://qriginals.com",
      lastModified: new Date(),
    },
    {
      url: "https://qriginals.com/gallery",
      lastModified: new Date(),
    },
    {
      url: "https://qriginals.com/create/new",
      lastModified: new Date(),
    },
    {
      url: "https://qriginals.com/credits",
      lastModified: new Date(),
    },
    {
      url: "https://qriginals.com/support",
      lastModified: new Date(),
    },
    ...creationUrls,
  ];
}
