/**
 * Ensures that a base64 image string has the correct data URI prefix.
 * Also handles placeholders and existing URLs.
 */
export const ensureBase64Prefix = (img: string): string => {
    if (!img || img === "null" || img === "undefined") return "/placeholder.svg";

    let cleanImg = img.trim();

    // Handle stringified JSON or double-quoted strings from backend
    if (cleanImg.startsWith('"') && cleanImg.endsWith('"')) {
        try {
            const parsed = JSON.parse(cleanImg);
            if (typeof parsed === 'string') cleanImg = parsed.trim();
        } catch (e) {
            cleanImg = cleanImg.slice(1, -1).trim();
        }
    }

    // Common placeholders or empty values
    if (!cleanImg || cleanImg === "null" || cleanImg === "undefined" || cleanImg === "[]") {
        return "/placeholder.svg";
    }

    // If it's a full URL, return as-is (but check for encoded spaces if needed)
    if (cleanImg.startsWith("http")) {
        return cleanImg;
    }

    // 4. Handle Case: Already has a data URI prefix
    if (cleanImg.startsWith("data:")) {
        const commaIndex = cleanImg.indexOf(",");
        if (commaIndex !== -1) {
            // Extract just the raw base64 part and clean it
            const rawData = cleanImg.substring(commaIndex + 1).replace(/\s/g, "");
            
            // Re-detect format from the raw data to ensure correct MIME type
            if (rawData.startsWith("/9j/") || rawData.startsWith("/9J/")) return `data:image/jpeg;base64,${rawData}`;
            if (rawData.startsWith("iVBO")) return `data:image/png;base64,${rawData}`;
            if (rawData.startsWith("UklG")) return `data:image/webp;base64,${rawData}`;
            
            // If we couldn't detect, keep original prefix but cleaned payload
            const prefix = cleanImg.substring(0, commaIndex + 1);
            return prefix + rawData;
        }
    }

    // 5. Handle Case: Raw base64 or other
    const rawData = cleanImg.replace(/\s/g, "");

    // Detect format based on base64 headers
    if (rawData.startsWith("/9j/") || rawData.startsWith("/9J/")) return `data:image/jpeg;base64,${rawData}`;
    if (rawData.startsWith("iVBO")) return `data:image/png;base64,${rawData}`;
    if (rawData.startsWith("UklG")) return `data:image/webp;base64,${rawData}`;

    // Default to jpeg if it looks like healthy base64
    if (/^[A-Za-z0-9+/=]{10,}$/.test(rawData.substring(0, 50))) {
        return `data:image/jpeg;base64,${rawData}`;
    }

    return cleanImg;
};

/**
 * Normalizes an image or array of images into a string array with prefixes ensured.
 */
export const normalizeImages = (images: string | string[] | undefined | null): string[] => {
    if (!images || images === "null" || images === "undefined") return ["/placeholder.svg"];

    let imageArray: string[] = [];
    
    if (Array.isArray(images)) {
        imageArray = images;
    } else if (typeof images === "string") {
        const trimmed = images.trim();
        if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
            try {
                const parsed = JSON.parse(trimmed);
                imageArray = Array.isArray(parsed) ? parsed : [trimmed];
            } catch (e) {
                imageArray = [trimmed];
            }
        } else {
            imageArray = [trimmed];
        }
    }

    // Filter out invalid items and map
    const normalized = imageArray
        .filter(img => img && img !== "null" && img !== "undefined")
        .map(ensureBase64Prefix);

    return normalized.length > 0 ? normalized : ["/placeholder.svg"];
};
