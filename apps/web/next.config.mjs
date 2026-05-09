/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@subtrack/db"],
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "logo.clearbit.com" },
      { protocol: "https", hostname: "www.google.com" },
    ],
  },
};

export default nextConfig;
