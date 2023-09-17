import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import Components from 'unplugin-vue-components/vite';
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers';
import UnoCss from 'unocss/vite';
// import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path';
// import mkcert from 'vite-plugin-mkcert'
// import fs from 'fs'
// import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        vue(),
        UnoCss(),
        AutoImport({
            resolvers: [ElementPlusResolver()],
        }),
        Components({
            resolvers: [ElementPlusResolver()],
        }),
        // mkcert()
        // createSvgIconsPlugin(
        //    {
        //   // 指定需要缓存的图标文件夹
        //   iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
        //   // 指定symbolId格式
        //   symbolId: 'icon-[dir]-[name]'
        //  }
        // ),
    ],
    resolve: {
        alias: {
            // 别名配置
            // 键必须以斜线开始和结束
            '@': resolve(__dirname, './src'),
            // components: resolve(__dirname, './src/components'),
            // assets: resolve(__dirname, './src/assets'),
            // '#': resolve(__dirname, 'types'),
            // build: resolve(__dirname, 'build')
        },
    },
    build: {},

    server: {
        // https: {
        // 	cert: fs.readFileSync(path.join(__dirname, 'keys/localhost+1.crt')),
        // 	key: fs.readFileSync(path.join(__dirname, 'keys/localhost+1-key.pem')),
        // },
        open: false, // 是否自动在浏览器打开
        cors: true, // 允许跨域  8月更新
        // proxy: {
        // 	'^/api': {
        // 		target: 'http://localhost:8000',   //代理接口
        // 		changeOrigin: true,
        // 		rewrite: (path) => path.replace(/^\/api/, '')
        // 	}
        // },
        host: true,
        port: 3000, // 端口号
        headers: {
            'Access-Control-Allow-Origin': '*',
        },
    },
});
