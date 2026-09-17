import type { MetadataRoute } from "next";

async function getAllProperties() {
  try {
    const API_BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/api";
    const response = await fetch(`${API_BASE}/hotels/featurelist`, {
      headers: {
        "x-api-key": process.env.NEXT_PUBLIC_X_API_KEY || "",
      },
      next: { revalidate: 3600 }
    });
    
    if (response.ok) {
      const result = await response.json();
      return Array.isArray(result?.data) ? result.data : Array.isArray(result) ? result : [];
    }
  } catch (error) {
    console.error("Failed to fetch properties for sitemap:", error);
  }
  return [];
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getAllProperties();

  const propertyUrls: MetadataRoute.Sitemap = properties.map((property: any) => {
    const id = property.id || property.hotelId || property._id;
    const name = property.name || "hotel";
    const type = (property.type || "hotels").toLowerCase();
    
    const validTypes = ["hotels", "resorts", "villas", "homestays"];
    const pathType = validTypes.includes(type) ? type : "hotels";
    
    const slugName = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const slug = `${id}_${slugName}`;
    
    return {
      url: `https://www.stayvida.in/${pathType}/${slug}`,
      lastModified: new Date(), // Could use updatedAt if API returns it
    };
  });

  return [
    {
      url: "https://www.stayvida.in",
      lastModified: new Date(),
    },
    {
      url: "https://www.stayvida.in/resorts",
      lastModified: new Date(),
    },
    {
      url: "https://www.stayvida.in/villas",
      lastModified: new Date(),
    },
    {
      url: "https://www.stayvida.in/hotels",
      lastModified: new Date(),
    },
    ...propertyUrls,
  ];
}
