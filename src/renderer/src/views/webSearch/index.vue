<template>
  <header class="border-b mb-6 pb-2 pr-2 overflow-hidden">
    <a-space v-show="state.webSrc && state.menuStatus === 0" class="float-left">
      <a-button @click="setBroswerOption(browserOptParamsOpt.BACK)">
        <icon-left />
      </a-button>
      <!-- <a-button @click="setBroswerOption(browserOptParamsOpt.FORWARD)">
        <icon-right />
      </a-button> -->
      <a-button type="primary" @click="() => analysisMenu()">解析目录</a-button>
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

  <a-spin
    :loading="state.menuLoading"
    :style="{
      width: '100%',
      height: 'calc(100% - 67px)'
    }"
    tip="正在解析目录中~请稍后"
  >
    <div
      ref="browserViewCtn"
      :class="`w-full h-full ${state.menuStatus == 0 ? 'flex justify-center items-center' : ''}`"
    >
      <a-empty v-if="!state.webSrc && !state.menuLoading" class="mb-24" description="暂无数据" />
      <!-- 解析成功  -->
      <div class="p-4 pt-0" v-if="state.menuStatus === 1">
        <a-checkbox
          class="pb-4"
          :model-value="virtualState.checkedAll"
          :indeterminate="virtualState.indeterminate"
          @change="handleChangeAll"
        >
          全选
        </a-checkbox>
        <a-checkbox-group v-model="virtualState.datas" @change="handleChange">
          <a-list
            class="w-full cursor-pointer"
            :virtualListProps="{
              height: virtualState.virtualListHeight - 90
            }"
            :data="state.menuList"
          >
            <template #header>
              <a-space>
                {{ state.searchValue }}
              </a-space>
            </template>

            <template #item="{ item, index }">
              <a-checkbox class="w-full pl-8" :value="index" :key="index">
                <a-list-item>
                  {{ item.title }}
                </a-list-item>
              </a-checkbox>
            </template>
          </a-list>
        </a-checkbox-group>
      </div>
      <!-- 解析失败 -->
      <div v-if="state.menuStatus === 2">
        <a-result status="error" title="目录解析失败">
          <template #subtitle>
            哎呀~解析出错了！您可以选择返回原网页或者尝试右上角重新搜索
          </template>

          <template #extra>
            <a-space>
              <a-button type="primary" @click="() => openBrowswerFromUrl(state.webSrc)">
                返回原网页
              </a-button>
              <a-button @click="() => seachWord(state.searchValue)"> 重新搜索 </a-button>
              <a-button @click="() => analysisMenu(state.webSrc)"> 重新解析 </a-button>
            </a-space>
          </template>
        </a-result>
      </div>
    </div>
  </a-spin>
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
import { Message } from '@arco-design/web-vue'
import { browserOptParamsType, browserOptParamsOpt, analysisMenuType } from '@commonTypes/handle'

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
  menuLoading: boolean
  menuList: analysisMenuType[]
  // 0无状态、1成功、2失败
  menuStatus: 0 | 1 | 2
}>({
  searchValue: '',
  searchWebValue: '百度',
  webSrc: '',

  menuLoading: false,
  menuStatus: 0,
  menuList: []
})

const virtualState = reactive<{
  virtualListHeight: number
  checkedAll: boolean
  indeterminate: boolean
  datas: number[]
}>({
  virtualListHeight: 529,
  checkedAll: false,
  indeterminate: false,
  datas: []
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
  virtualState.virtualListHeight = height
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

const analysisMenu = async (webSrc: string = '') => {
  if (!webSrc) {
    webSrc = await ipcRenderer.invoke('getCurrentBroswerViewUrl')
    // 关闭窗口
    await ipcRenderer.invoke('closeCurrentBroswerView')
  }
  state.webSrc = webSrc
  state.menuStatus = 0
  state.menuLoading = true
  // todo 提示一下接下来的动作，并记录下次是否仍然提醒
  const menuList: analysisMenuType[] = await ipcRenderer.invoke('analysisWebToMenu', webSrc)
  state.menuLoading = false
  if (menuList.length) {
    Message.success('目录解析成功')
    state.menuStatus = 1
    state.menuList = menuList
  } else {
    Message.error('目录解析失败')
    state.menuStatus = 2
  }
}

const handleChangeAll = (value) => {
  console.log('value', value)
  virtualState.indeterminate = false
  if (value) {
    virtualState.checkedAll = true
    virtualState.datas = state.menuList.map((_item, index) => index)
  } else {
    virtualState.checkedAll = false
    virtualState.datas = []
  }
}

const handleChange = (values) => {
  if (values.length === state.menuList.length) {
    virtualState.checkedAll = true
    virtualState.indeterminate = false
  } else if (values.length === 0) {
    virtualState.checkedAll = false
    virtualState.indeterminate = false
  } else {
    virtualState.checkedAll = false
    virtualState.indeterminate = true
  }
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
