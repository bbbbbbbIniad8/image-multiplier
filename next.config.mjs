const nextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },

  basePath: process.env.NODE_ENV === 'production' ? '/image-multiplier' : '',
};

export default nextConfig;