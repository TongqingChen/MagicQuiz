import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import { resolve } from 'path'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      resolvers: [ElementPlusResolver()],
    }),
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
  // server:{
  //   open: true //自动打开浏览器
  // }
})

