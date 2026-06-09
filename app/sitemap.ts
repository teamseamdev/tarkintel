import type {
  MetadataRoute,
} from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    "https://tarkintel.com";

  return [
    {
      url: baseUrl,

      lastModified:
        new Date(),

      changeFrequency:
        "daily",

      priority: 1,
    },

    {
      url:
        `${baseUrl}/tasks`,

      lastModified:
        new Date(),

      changeFrequency:
        "hourly",

      priority: 0.9,
    },

    {
      url:
        `${baseUrl}/items`,

      lastModified:
        new Date(),

      changeFrequency:
        "daily",

      priority: 0.9,
    },

    {
      url:
        `${baseUrl}/hideout`,

      lastModified:
        new Date(),

      changeFrequency:
        "daily",

      priority: 0.9,
    },

    {
      url:
        `${baseUrl}/profile`,

      lastModified:
        new Date(),

      changeFrequency:
        "weekly",

      priority: 0.7,
    },
  ];
}