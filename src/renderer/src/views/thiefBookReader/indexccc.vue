<template>
  <div class="ctn break-words">
    {{ state.charpart }}
    <!-- <p class="paragraph" v-for="(item, index) in state.charpart" :key="index">{{ item }}</p> -->
  </div>
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
const { ipcRenderer } = window.electron
const state = reactive<{
  charpart: string
}>({
  charpart: ''
})
// 获取小说内容
const getFileCtn = async () => {
  const res = await ipcRenderer.invoke(
    'getFiles',
    `/Users/mdny/Documents/soureTreeDoucment/prviate_novel/src/renderer/src/views/thiefBookReader/tt.txt`
  )
  // state.charpart = res.map(item => item.trim()).filter(Boolean)
  state.charpart = res.join('')
  console.log(state.charpart)
}
getFileCtn()

// todo 判断一页能放多少文本--内定一个字，通过canvas获取这个字单独的dom的大小，
// 然后处理根据窗口尺寸，来判断最多展示多少个字向下取整，从而获取到对应的对应的分页和展示

// todo 判断前进后退、跳章节等问题

// todo 设置对应前进后退快捷键（全局？）
// todo 根据颜色动态设置反色 tinycolor2.complement
</script>

<style lang="less" scoped>
.ctn {
  -webkit-app-region: drag !important;
  cursor: move;
  width: 100vw;
  height: 100vh;
}
.paragraph {
  text-indent: 2em;
}
</style>
