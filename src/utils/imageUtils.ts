/**
 * Ensures that a base64 image string has the correct data URI prefix.
 * Also handles placeholders and existing URLs.
 */
export const ensureBase64Prefix = (img: string): string => {
    if (!img) return "/placeholder.svg";

    let cleanImg = img.trim();

    // If it's a full URL or already a valid data URI, return as-is
    if (cleanImg.startsWith("http") || (cleanImg.startsWith("data:image/") && cleanImg.includes(","))) {
        return cleanImg;
    }

    // Strip existing data URI prefix if present to check actual content
    if (cleanImg.startsWith("data:")) {
        const commaIndex = cleanImg.indexOf(",");
        if (commaIndex !== -1) {
            cleanImg = cleanImg.substring(commaIndex + 1);
        }
    }

    // Detect format based on base64 headers of the raw content
    // JPEG: /9j/
    if (cleanImg.startsWith("/9j/")) return `data:image/jpeg;base64,${cleanImg}`;

    // PNG: iVBO
    if (cleanImg.startsWith("iVBO")) return `data:image/png;base64,${cleanImg}`;

    // WebP: UklG
    if (cleanImg.startsWith("UklG")) return `data:image/webp;base64,${cleanImg}`;

    // Default to jpeg if it looks like base64 but format is unknown
    if (/^[A-Za-z0-9+/=]{10,}$/.test(cleanImg.substring(0, 100))) {
        return `data:image/jpeg;base64,${cleanImg}`;
    }

    return cleanImg;
};

/**
 * Normalizes an image or array of images into a string array with prefixes ensured.
 */
export const normalizeImages = (images: string | string[] | undefined | null): string[] => {
    if (!images) return ["/placeholder.svg"];

    const imageArray = Array.isArray(images) ? images : [images];

    return imageArray.map(ensureBase64Prefix);
};
