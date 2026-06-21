import createMDX from "@next/mdx"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Allow MDX files to be treated as pages/imports
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/array/:path*",
        destination: "https://us-assets.i.posthog.com/array/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ]
  },
  skipTrailingSlashRedirect: true,
}

const withMDX = createMDX({})

export default withMDX(nextConfig)
