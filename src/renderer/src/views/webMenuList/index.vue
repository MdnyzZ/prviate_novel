<template>
  <header class="border-b mb-6 pb-2 pr-2 overflow-hidden">
    <a-space v-show="state.webSrc" class="float-left">
      <a-button @click="setBroswerOption(browserOptParamsOpt.BACK)">
        <icon-left />
      </a-button>
      <!-- <a-button @click="setBroswerOption(browserOptParamsOpt.FORWARD)">
        <icon-right />
      </a-button> -->
      <a-button type="primary" @click="analysisMenu">解析目录</a-button>
    </a-space>
    <a-space class="float-right">
      <a-input-search
        v-model="state.searchValue"
        :style="{ width: '320px' }"
        placeholder="请输入小说名"
        allow-clear
        @search="seachWord"
      >
        <template #prepend>
          <a-select :style="{ width: '80px' }" v-model="state.searchWebValue">
            <a-option v-for="(item, index) in searchWebSele" :key="index" :value="item.key">
              {{ item.label }}
            </a-option>
          </a-select>
        </template>
      </a-input-search>
    </a-space>
  </header>
  <div
    ref="browserViewCtn"
    :style="{
      width: '100%',
      height: 'calc(100% - 65px)'
    }"
    class="flex justify-center items-center"
  >
    <a-empty v-if="!state.webSrc" class="mb-24" description="暂无数据" />
  </div>
</template>

<script lang="ts" setup>
// // todo
// 1. 搜索
// 2. 详情解析
// 3. 目录解析
// 4. 每章内容解析
// 5. 自动分页解析
// 6. 下载时根据章节下载，然后错误的支持重试
// 7. 暂定yuyouge一个网站来处理
import { reactive, ref, onMounted, nextTick, onBeforeUnmount } from 'vue'
const { ipcRenderer } = window.electron
import { useAppStore } from '@renderer/store/index'
import { browserOptParamsType, browserOptParamsOpt } from '@commonTypes/handle'

const userData = useAppStore()

const searchWebSele = [
  {
    label: '百度',
    fn: (val) => {
      return `https://www.baidu.com/s?wd=${val}`
    },
    key: '百度'
  },
  {
    label: '必应',
    fn: (val) => {
      return `https://cn.bing.com/search?q=${val}`
    },
    key: '必应'
  },
  {
    label: '谷歌',
    fn: (val) => {
      return `https://www.google.com.hk/search?q=${val}`
    },
    key: '谷歌'
  }
]
const browserViewCtn = ref()

const state = reactive<{
  searchValue: string
  searchWebValue: string
  webSrc: string
}>({
  searchValue: '',
  searchWebValue: '百度',
  webSrc: ''
})

const seachWord = (val: string) => {
  if (!val) {
    ipcRenderer.invoke('closeCurrentBroswerView')
    state.webSrc = ''
    return
  }
  let mb = searchWebSele.find((e) => e.label == state.searchWebValue)
  state.webSrc = mb?.fn(val) || ''
  openBrowswerFromUrl(state.webSrc)
}

const openBrowswerFromUrl = (url: string) => {
  const {
    offsetLeft: x,
    offsetTop: y,
    offsetWidth: width,
    offsetHeight: height
  } = browserViewCtn.value

  ipcRenderer.invoke('openBroswerView', {
    x,
    y,
    width,
    height,
    url
  })
}

const setBroswerOption = async (opt: browserOptParamsOpt) => {
  const res = await ipcRenderer.invoke('broswerOption', {
    opt,
    type: browserOptParamsType.VIEW
  })
  console.log('res', res)
}

const analysisMenu = async () => {
  const webSrc = await ipcRenderer.invoke('getCurrentBroswerViewUrl')
  console.log(webSrc)
  
  const body = await ipcRenderer.invoke('analysisWebToMenu', webSrc)
  console.dir(body)
}

onMounted(async () => {
  const { searchWebSrc, searchWebTiltleValue, searchWebValue } = userData.searchWebInitData
  state.webSrc = searchWebSrc
  state.searchValue = searchWebTiltleValue
  state.searchWebValue = searchWebValue
  if (searchWebSrc) {
    await nextTick()
    openBrowswerFromUrl(searchWebSrc)
  }
})

onBeforeUnmount(async () => {
  const webSrc = await ipcRenderer.invoke('getCurrentBroswerViewUrl')
  userData.updateSettings({
    searchWebSrc: webSrc,
    searchWebTiltleValue: state.searchValue,
    searchWebValue: state.searchWebValue
  })
  ipcRenderer.invoke('closeCurrentBroswerView')
})
</script>

<style lang="less" scoped></style>
