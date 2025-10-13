import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { hostname: "lh3.googleusercontent.com" },
      { hostname: "flagcdn.com" },
      { hostname: "mainfacts.com" },
      { hostname: "upload.wikimedia.org" },
    ],
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "script-src 'none'; sandbox;",
  },
};

const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);
