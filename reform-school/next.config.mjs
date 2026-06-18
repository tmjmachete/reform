/** @type {import('next').NextConfig} */
const nextConfig = {
  // Serves the whole app under reformpod.vercel.app/school without touching
  // the existing static site (Next.js Multi-Zones pattern). next/link and
  // next/image auto-prepend this; plain <a> to the main site must NOT.
  basePath: '/school',
  reactStrictMode: true,
};

export default nextConfig;
