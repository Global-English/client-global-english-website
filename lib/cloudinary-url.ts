type CloudinaryOptimizeOptions = {
  width?: number
  height?: number
  crop?: "fill" | "limit" | "fit" | "thumb"
  gravity?: "auto" | "face"
  quality?: "auto" | number
  format?: "auto" | "webp" | "avif" | "jpg" | "png"
  dpr?: "auto" | number
  progressive?: boolean
}

const CLOUDINARY_HOSTNAME = "res.cloudinary.com"
const CLOUDINARY_UPLOAD_SEGMENT = "/upload/"

function normalizePositiveNumber(value?: number) {
  if (!Number.isFinite(value) || !value) return undefined
  const normalized = Math.round(value)
  return normalized > 0 ? normalized : undefined
}

export function optimizeCloudinaryUrl(
  src: string,
  {
    width,
    height,
    crop,
    gravity,
    quality = "auto",
    format = "auto",
    dpr = "auto",
    progressive = true,
  }: CloudinaryOptimizeOptions = {}
) {
  if (!src) return src

  let parsedUrl: URL
  try {
    parsedUrl = new URL(src)
  } catch {
    return src
  }

  if (parsedUrl.hostname !== CLOUDINARY_HOSTNAME) {
    return src
  }

  const uploadIndex = src.indexOf(CLOUDINARY_UPLOAD_SEGMENT)
  if (uploadIndex === -1) {
    return src
  }

  const uploadStart = uploadIndex + CLOUDINARY_UPLOAD_SEGMENT.length
  const afterUpload = src.slice(uploadStart)
  const firstSegment = afterUpload.split("/")[0] ?? ""
  const isVersionSegment = /^v\d+$/.test(firstSegment)
  const alreadyOptimized =
    !isVersionSegment &&
    ["f_auto", "q_auto", "dpr_auto", "fl_progressive"].some((token) =>
      firstSegment.includes(token)
    )

  if (alreadyOptimized) {
    return src
  }

  const normalizedWidth = normalizePositiveNumber(width)
  const normalizedHeight = normalizePositiveNumber(height)
  const resolvedCrop = crop ?? (normalizedWidth || normalizedHeight ? "limit" : undefined)

  const transformations = [
    format ? `f_${format}` : undefined,
    quality !== undefined ? `q_${quality}` : undefined,
    dpr !== undefined ? `dpr_${dpr}` : undefined,
    progressive ? "fl_progressive" : undefined,
    resolvedCrop ? `c_${resolvedCrop}` : undefined,
    gravity ? `g_${gravity}` : undefined,
    normalizedWidth ? `w_${normalizedWidth}` : undefined,
    normalizedHeight ? `h_${normalizedHeight}` : undefined,
  ].filter(Boolean)

  if (!transformations.length) {
    return src
  }

  const transformSegment = transformations.join(",")
  return `${src.slice(0, uploadStart)}${transformSegment}/${afterUpload}`
}
