import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import { vitePluginForArco } from '@arco-plugins/vite-vue'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

export default defineConfig({
  main: {
    resolve: {
      alias: [
        {
          find: '@commonTypes',
          replacement: resolve('src/commonTypes')
        },
        {
          find: '@mainsPage',
          replacement: resolve('src/main')
        }
      ]
    },
    plugins: [externalizeDepsPlugin()]
  },
  preload: {
    resolve: {
      alias: [
        {
          find: '@commonTypes',
          replacement: resolve('src/commonTypes')
        },
        {
          find: '@mainsPage',
          replacement: resolve('src/main')
        }
      ]
    },
    plugins: [externalizeDepsPlugin()]
  },
  renderer: {
    resolve: {
      alias: [
        {
          find: '@renderer',
          replacement: resolve('src/renderer/src')
        },
        {
          find: '@commonTypes',
          replacement: resolve('src/commonTypes')
        },
        {
          find: '@mainsPage',
          replacement: resolve('src/main')
        },
        {
          find: 'vue',
          replacement: 'vue/dist/vue.esm-bundler.js' // compile template
        }
      ]
    },
    plugins: [vue(), vueJsx(), vitePluginForArco({ style: 'css' })]
  }
})
