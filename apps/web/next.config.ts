import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ["@bitwork/ui", "@bitwork/db", "@bitwork/ai"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
