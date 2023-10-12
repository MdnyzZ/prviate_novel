<template>
  <div ref="wrapperBox" class="overflow-hidden relative h-full">
    <div class="optMask absolute h-full w-full bg-gray-300 z-10 opacity-0">
      <div class="l w-1/2 h-full bg-red-200 absolute left-0 t-0" @click="prev"></div>
      <div class="r w-1/2 h-full bg-blue-200 absolute right-0 t-0" @click="next"></div>
      <div
        class="m w-1/3 h-1/2 bg-green-200 absolute left-1/2 top-1/2 -translate-y-1/2 -translate-x-1/2"
        @click="optFn"
      ></div>
    </div>

    <article
      :style="{
        columns: `${wrapperWidth} 1`,
        transform: `translateX(-${(wrapperWidth - 24) * (pageInfo.current - 1)}px)`
      }"
    >
      <p v-for="(part, index) in charpart" :key="index">{{ part }}</p>
      <p ref="lastLineRef"></p>
    </article>

    <div class="absolute bottom-0 left-0">
      {{ pageInfo.current }} / {{ pageInfo.total }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
// import { getLocalFile } from '@renderer/api/common'
const wrapperBox = ref()
const lastLineRef = ref()
const wrapperWidth = ref<number>(0)
const pageInfo = ref<{
  current: number
  total: number
}>({
  current: 1,
  total: 10
})
const { ipcRenderer } = window.electron
const charpart = ref<string>('')

const getFileCtn = async () => {
  const res = await ipcRenderer.invoke(
    'getFiles',
    '/Users/mdny/Documents/soureTreeDoucment/prviate_novel/src/renderer/src/views/bookDetails/tt.txt'
  )
  console.log('res', res)
  charpart.value = res
}

getFileCtn()

onMounted(() => {
  setTimeout(() => {
    wrapperWidth.value = wrapperBox.value.parentNode.offsetWidth
    // wrapperWidth.value = 100
    console.log(lastLineRef.value.offsetLeft)
    console.log(wrapperBox.value.scrollWidth)
    pageInfo.value.total = Math.ceil(wrapperBox.value.scrollWidth / (wrapperWidth.value - 24))
    console.log('pageInfo.total', pageInfo.value.total)
  }, 300)
})
const next = () => {
  const { current, total } = pageInfo.value
  if (current < total) {
    pageInfo.value.current++
  }
}
const prev = () => {
  const { current } = pageInfo.value
  if (current > 1) {
    pageInfo.value.current--
  }
}
const optFn = () => {
  alert('中间区域')
}
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

article {
  column-gap: 24px;
  height: calc(100% - 20px);
  transition: 0.3s;
}
</style>
