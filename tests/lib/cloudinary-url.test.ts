import { describe, expect, it } from "vitest"

import { optimizeCloudinaryUrl } from "@/lib/cloudinary-url"

describe("optimizeCloudinaryUrl", () => {
  it("aplica transformações padrão em URL do Cloudinary", () => {
    const input = "https://res.cloudinary.com/demo/image/upload/v12345/folder/photo.jpg"

    const output = optimizeCloudinaryUrl(input)

    expect(output).toContain("/upload/f_auto,q_auto,dpr_auto,fl_progressive/")
    expect(output).toContain("/v12345/folder/photo.jpg")
  })

  it("não altera URL fora do Cloudinary", () => {
    const input = "https://example.com/image.jpg"

    expect(optimizeCloudinaryUrl(input)).toBe(input)
  })

  it("não duplica otimização quando já existe transformação automática", () => {
    const input = "https://res.cloudinary.com/demo/image/upload/f_auto,q_auto,dpr_auto,fl_progressive/v12345/folder/photo.jpg"

    expect(optimizeCloudinaryUrl(input)).toBe(input)
  })

  it("aplica largura, altura e crop quando informado", () => {
    const input = "https://res.cloudinary.com/demo/image/upload/v12345/folder/photo.jpg"

    const output = optimizeCloudinaryUrl(input, {
      width: 320,
      height: 200,
      crop: "fill",
      gravity: "auto",
    })

    expect(output).toContain("w_320")
    expect(output).toContain("h_200")
    expect(output).toContain("c_fill")
    expect(output).toContain("g_auto")
  })
})
