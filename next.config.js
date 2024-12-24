// @ts-check

/**
 * @type {import('next').NextConfig}
 **/
const nextConfig = {
    /* config options here */
    typescript: {
        ignoreBuildErrors: true,
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'static.nike.com',
                port: '',

            },
            {
                protocol: 'https',
                hostname: 'freight.cargo.site',
                port: '',
            }, {
                protocol: 'https',
                hostname: 'media.about.nike.com',
                port: '',
            }
            ,
            {
                protocol: 'https',
                hostname: 'images.lifestyleasia.com',
                port: '',
            }
            ,
            {
                protocol: 'https',
                hostname: 'utfs.io',
                port: '',
            }
            ,
            {
                protocol: 'https',
                hostname: 'i.dummyjson.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: 'i0.wp.com',
                port: '',
            },
            {
                protocol: 'https',
                hostname: '*.liara.run',
                port: '',
            }
        ],
    },
}

module.exports = nextConfig