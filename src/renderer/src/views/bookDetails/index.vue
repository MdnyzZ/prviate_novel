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
    <div class="absolute bottom-0 left-0">{{ pageInfo.current }} / {{ pageInfo.total }}</div>

    <a-drawer
      :width="340"
      :height="340"
      :closable="false"
      :footer="false"
      v-model:visible="drawerShow"
      placement="right"
    >
      <template #title> {{ RouteQuery.title }} </template>

      <a-list :bordered="false">
        <a-list-item
          v-for="(item, index) in RouteQuery.directory"
          :key="index"
          @click="getFileCtn(item)"
        >
          {{ item }}
        </a-list-item>
      </a-list>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
import { ref, reactive, onMounted, nextTick, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
const Route = useRoute()
const RouteQuery = Route.query as Record<string, any>
// import { getLocalFile } from '@renderer/api/common'
const wrapperBox = ref()
const lastLineRef = ref()
const wrapperWidth = ref<number>(0)
const drawerShow = ref<boolean>(false)
const loading = ref<boolean>(false)
const pageInfo = reactive<{
  current: number
  total: number
  charpartIndex: number
  menuLen: number
}>({
  current: 1,
  total: 10,
  charpartIndex: 1,
  menuLen: 10
})
const { ipcRenderer } = window.electron
const charpart = ref<string>('')

// 获取小说内容
const getFileCtn = async (item, index = 1) => {
  loading.value = true
  const { path } = RouteQuery
  pageInfo.charpartIndex = index
  const res = await ipcRenderer.invoke('getFiles', `${path}/${item}.txt`)
  charpart.value = res
  loading.value = false
  await nextTick()
  setTimeout(() => {
    initPage(index)
    drawerShow.value = false
    document.title = item
  }, 50)
}

const next = () => {
  const { current, total } = pageInfo
  if (current < total) {
    pageInfo.current++
  } else {
    const { charpartIndex, menuLen } = pageInfo
    let nextIndex = charpartIndex + 1
    if (nextIndex < menuLen) charpartIndexSetCtn(nextIndex)
  }
}
const prev = () => {
  const { current } = pageInfo
  if (current > 1) {
    pageInfo.current--
  } else {
    const { charpartIndex } = pageInfo
    let preIndex = charpartIndex - 1
    if (preIndex > 0) charpartIndexSetCtn(preIndex)
  }
}
const optFn = () => {
  // alert('中间区域')
  drawerShow.value = true
}

const charpartIndexSetCtn = async (index) => {
  const item = RouteQuery.directory[index]
  await getFileCtn(item, index)
}

const initPage = (charpartIndex) => {
  wrapperWidth.value = wrapperBox.value.parentNode.offsetWidth
  pageInfo.total = Math.ceil(wrapperBox.value.scrollWidth / (wrapperWidth.value - 24))
  pageInfo.current = 1
  pageInfo.charpartIndex = charpartIndex
  pageInfo.menuLen = RouteQuery.directory.length
}

onMounted(async () => {
  await charpartIndexSetCtn(0)
})

onUnmounted(() => {
  document.title = '阅读器'
})
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
