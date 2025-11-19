/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: ['localhost', 'minio', 'cleanstore-minio'],
        remotePatterns: [
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '9000',
                pathname: '/cleanstore/**',
            },
            {
                protocol: 'http',
                hostname: 'minio',
                port: '9000',
                pathname: '/cleanstore/**',
            },
            {
                protocol: 'http',
                hostname: 'cleanstore-minio',
                port: '9000',
                pathname: '/cleanstore/**',
            },
        ],
    },
    async rewrites() {
        const backendUrl = process.env.BACKEND_URL || 'http://cleanstore-backend:4000';
        return [
            {
                source: '/api/:path*',
                destination: `${backendUrl}/:path*`,
            },
        ];
    },
};

module.exports = nextConfig;