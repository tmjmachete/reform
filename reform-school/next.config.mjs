/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    // Required for middleware.ts to run on the Node.js runtime (not Edge),
    // which is necessary because @supabase/ssr uses Node-only modules.
    nodeMiddleware: true,
  },
};

export default nextConfig;
