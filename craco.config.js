const path = require('path')
const outputPath = path.join(__dirname, 'dist')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
    style: {
        postcss: {
            plugins: [
                require('tailwindcss'),
                require('autoprefixer'),
            ],
        },
    },
    webpack: {
        // 别名。加上后导致页面刷新后无内容显示
        // alias: {
        //     '~': path.resolve("src"),
        // },
        // 重写webpack配置
        configure: (webpackConfig, {env, paths}) => {
            paths.appBuild = outputPath
            webpackConfig.output = {
                filename: '[name].js',
                path: outputPath,
            }
            return webpackConfig
        },
        plugins: [
            new CopyWebpackPlugin({patterns: [{from: 'public', to: outputPath}]})
        ],
    },
}
