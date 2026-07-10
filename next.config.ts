import createMDX from "@next/mdx"
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Allow MDX files to be treated as pages/imports
  pageExtensions: ["ts", "tsx", "js", "jsx", "md", "mdx"],
  async redirects() {
    return [
      // The tariff tool was removed (2026-07); its URLs were indexed/shared.
      {
        source: "/:lang(en|zh-TW)/tariff",
        destination: "/:lang",
        permanent: true,
      },
      // /export-plan retired with the forwarder pivot (2026-07); the funnel
      // is now /demo. Bare rule too — these run before proxy.ts localizes.
      {
        source: "/:lang(en|zh-TW)/export-plan",
        destination: "/:lang/demo",
        permanent: true,
      },
      {
        source: "/export-plan",
        destination: "/demo",
        permanent: true,
      },
    ]
  },
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
