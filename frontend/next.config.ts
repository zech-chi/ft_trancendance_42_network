// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: 'lh3.googleusercontent.com',
//       },
//     ],
//   },
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["lh3.googleusercontent.com"],
    unoptimized: true, // ✅ Prevents Next.js from re-fetching and hitting Google rate limits
  },
  eslint: {
    ignoreDuringBuilds: true, // optional, prevents ESLint build errors
  },
};

module.exports = nextConfig;

