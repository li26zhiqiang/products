const { defineConfig } = require('@vue/cli-service');
const ElementPlus = require('unplugin-element-plus/webpack');
const path = require('path');
// const CopyWebpackPlugin = require('copy-webpack-plugin');
const { name } = require('./package');
const tagVersion = process.env.npm_condfig_tagVersion;
const appName = 'products';

function resolve(dir) {
    return path.join(__dirname, dir);
}

module.exports = defineConfig({
    transpileDependencies: true,
    publicPath: `/${appName}`,
    devServer: {
        hot: true,
        historyApiFallback: true,
        allowedHosts: 'all',
        port: 4455,
        client: {
            overlay: false
        },
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*'
        }
    },
    pages: {
        index: {
            // page 的入口
            entry: 'src/main.js',
            // 模板来源
            template: 'public/index.html',
            // 在 dist/index.html 的输出
            filename: 'index.html',
            // 当使用 title 选项时，
            // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
            title: 'products'
        }
    },
    configureWebpack: {
        resolve: {
            alias: {
                '@': resolve('src'),
                '@components': resolve('/src/components'),
                '@utils': resolve('/src/utils')
            },
            extensions: ['.tsx', '.ts'] // 添加 .ts 扩展名
        },
        output: {
            filename: 'js/[name].js',
            chunkFilename: `js/${name}.[name].[contenthash:8].${tagVersion || 'chunk'}.js`,
            library: `${name}-[name]`,
            libraryTarget: 'umd', // 把子应用打包成 umd 库格式
            chunkLoadingGlobal: `webpackJsonp_${name}`
        },
        plugins: [
            // new CopyWebpackPlugin({
            //     patterns: [
            //         {
            //             from: path.resolve(__dirname, './static'),
            //             to: path.resolve(__dirname, './dist'),
            //             toType: 'dir',
            //             noErrorOnMissing: true,
            //             globOptions: {
            //                 ignore: ['.*']
            //             },
            //             info: {
            //                 minimized: true
            //             }
            //         }
            //     ]
            // }),
            ElementPlus({
                useSource: true
            })
        ]
    },

    chainWebpack: (config) => {
        // 原svg规则覆盖了所有的svg图标，需要先将自己的svg排除，以应用新的sprite规则
        // src/assets/icons是我们将要存放svg的目录
        config.module.rule('svg').exclude.add(resolve('src/icons')).end();
        config.module
            .rule('icons')
            .test(/\.svg$/)
            .include.add(resolve('src/icons'))
            .end()
            .use('svg-sprite-loader')
            .loader('svg-sprite-loader')
            .options({
                symbolId: 'icon-[name]'
            })
            .end();

        config.module.rule('fonts').type('asset/inline').set('generator', {});
        config.module.rule('images').type('asset/inline').set('generator', {});
    },
    css: {
        extract: true,
        loaderOptions: {
            less: {
                javascriptEnabled: true,
                modifyVars: {
                    namespace: 'iam',
                    'primary-color': '#18b3b3',
                    'multiple-height': '30px',
                    'header-height': '48px',
                    'logo-width': '32px',
                    'iconify-bg-color': '#5551',
                    'border-color-base': '#d9d9d9',
                    'disabled-color': '#F5F5F5',
                    'screen-xl': '1200px',
                    'screen-lg': '992px',
                    'screen-md': '768px',
                    'screen-sm': '576px',
                    white: '#ffffff',
                    'error-color': '#f5222d',
                    'warning-color': '#faad14',
                    'success-color': '#52c41a',
                    'component-background': '#ffffff'
                }
            },
            scss: {
                additionalData: '@use "@/styles/element/index.scss" as *;'
            }
        }
    },
    // lintOnSave: 'warning'
    lintOnSave: false
});
