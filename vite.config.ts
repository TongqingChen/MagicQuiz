import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path, { resolve } from 'path'
import UnoCss from 'unocss/vite'
// import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'


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
  // server:{
  //   open: true //自动打开浏览器
  // }
})

