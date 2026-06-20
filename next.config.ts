import createMDX from "@next/mdx"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Allow MDX files to be treated as pages/imports
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
