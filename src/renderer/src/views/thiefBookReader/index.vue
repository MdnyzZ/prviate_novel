<template>
  <div ref="wrapperBox" class="overflow-hidden wrapperBox">
    <article
      :style="{
        color: '#acb2be',
        columns: `${wrapperWidth} 1`,
        transform: `translateX(-${(wrapperWidth + 24) * (pageInfo.current - 1)}px)`
      }"
    >
      {{ charpart }}
      <p ref="lastLineRef"></p>
    </article>
    <!-- <div class="absolute bottom-0 left-0">{{ pageInfo.current }} / {{ pageInfo.total }}</div> -->
  </div>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { ref, reactive, onMounted, nextTick, onUnmounted } from 'vue'
import ShortcutsNpm from 'shortcuts'
import { getBookListApi } from '@renderer/api/index'
const { query } = useRoute()
const detailId: number = Number(query.id)
let RouteQuery: Record<string, any> = {}
const wrapperBox = ref()
const lastLineRef = ref()
const wrapperWidth = ref<number>(0)
const loading = ref<boolean>(false)
const Shortcuts = ref<any>(null)
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
  charpart.value = res.join('')
  loading.value = false
  await nextTick()
  setTimeout(() => {
    initPage(index)
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
  console.log(222)
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
  console.log(333)
}

const charpartIndexSetCtn = async (index) => {
  const item = RouteQuery?.directory?.[index]
  await getFileCtn(item, index)
}

const initPage = (charpartIndex) => {
  wrapperWidth.value = wrapperBox.value.parentNode.offsetWidth
  pageInfo.total = Math.ceil(wrapperBox.value.scrollWidth / wrapperWidth.value)
  pageInfo.current = 1
  pageInfo.charpartIndex = charpartIndex
  pageInfo.menuLen = RouteQuery?.directory?.length
}

const registerShortcuts = () => {
  Shortcuts.value = new ShortcutsNpm({
    capture: true, // Handle events during the capturing phase
    target: document, // Listening for events on the document object
    shouldHandleEvent(_event) {
      return true // Handle all possible events
    }
  })

  Shortcuts.value.add([
    {
      shortcut: 'Shift+>',
      handler: () => {
        next()
        return true // Returning true if we don't want other handlers for the same shortcut to be called later
      }
    },
    {
      shortcut: 'Shift+<',
      handler: () => {
        prev()
        return true // Returning true if we don't want other handlers for the same shortcut to be called later
      }
    }
  ])
  Shortcuts.value.start()
}

const removeShortcuts = () => {
  Shortcuts.value.remove({ shortcut: 'CmdOrCtrl+>' })
  Shortcuts.value.remove({ shortcut: 'CmdOrCtrl+<' })
  Shortcuts.value.stop()
}

onMounted(async () => {
  const result = await getBookListApi({
    page: 1,
    pageSize: 10,
    id: detailId
  })
  if (result.success && result?.data?.list) {
    RouteQuery = result.data.list[0]
    await charpartIndexSetCtn(0)
    registerShortcuts()
  }
})

onUnmounted(() => {
  document.title = '阅读器'
  removeShortcuts()
})
</script>

<style lang="less" scoped>
.wrapperBox {
  -webkit-app-region: drag !important;
  cursor: move;
  width: 100vw;
  height: 100vh;
}
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
