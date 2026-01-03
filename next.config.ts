import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_DEEPL_API_KEY: process.env.DEEPL_API_KEY || '',
    NEXT_PUBLIC_GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
    NEXT_PUBLIC_OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
  },
};

export default nextConfig;
