/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    images: {
        domains: ['localhost'], // Ajusta según tu entorno de producción
    },
};

export default nextConfig;
