const path = require('path');
const withSass = require('@zeit/next-sass');
module.exports = withSass({
    cssModules: true
});

/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    sassOptions: {
        includePaths: [
            path.join(__dirname, 'styles')
        ],
    },
};

module.exports = nextConfig;
