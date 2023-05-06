import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import UnoCss from 'unocss/vite'
// import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
import { resolve } from 'path'


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
    }
  },

  server: {
    // https: true, // 是否开启 https
    open: false, // 是否自动在浏览器打开
    cors: true, // 允许跨域  8月更新
    host: true,
    port: 3000, // 端口号
    headers:{ 
      'Access-Control-Allow-Origin':'*'
    },
  },
})