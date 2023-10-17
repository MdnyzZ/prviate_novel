<template>
  <header class="border-b mb-6 pb-2 pr-2 overflow-hidden">
    <!-- 导入书籍 -->
    <a-tooltip content="导入书籍">
      <a-button
        :loading="loading.import"
        class="float-right"
        type="outline"
        size="mini"
        @click="importBookFn"
      >
        <icon-plus />
      </a-button>
    </a-tooltip>
  </header>

  <a-spin dot :loading="loading.load">
    <div class="flex justify-start flex-wrap items-center">
      <div
        class="relative flex flex-col justify-center cursor-pointer rounded-md mr-6 overflow-hidden hover:shadow-lg"
        v-for="(item, index) in books"
        :key="index"
        @click="goDetail(item)"
      >
        <a-image
          width="120"
          height="150"
          fit="fill"
          :preview="false"
          :src="item.image || defaultCoverImg"
        />
        <span class="text-center leading-8 text-gray-800">{{ item.title }}</span>
        <div
          class="absolute top-0 left-0 w-full h-full pb-10 px-2 pt-2 text-l absoluteTxt text-gray-600"
          v-if="!item.image"
        >
          {{ item.title }}
        </div>
      </div>
    </div>
  </a-spin>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import defaultCoverImg from '@renderer/assets/image/default_cover_img.jpeg'

const { ipcRenderer } = window.electron

const router = useRouter()

interface booksListType {
  id: number
  title: string
  image: string
  createTime: string
  path: string
}

const books = ref<booksListType[]>([])
const loading = ref<Record<string, boolean>>({
  import: false,
  load: false
})

const goDetail = (book: booksListType) => {
  console.log('book', book)
  // todo 跳转到阅读页面
  router.push({
    name: 'bookDetails',
    query: {
      ...book
    }
  })
}

const getList = async ({ page = 1, pageSize = 10 }) => {
  loading.value.load = true
  const result = await ipcRenderer.invoke('getBookList', {
    page,
    pageSize
  })

  loading.value.load = false
  if (result.success) books.value = result.data.list
}
const importBookFn = async () => {
  loading.value.import = true
  const result = await ipcRenderer.invoke('importBook')
  loading.value.import = false
  if (result.success) {
    Message.success('导入书籍成功')
    getList({ page: 1, pageSize: 9999 })
  }
}

onMounted(() => {
  getList({ page: 1, pageSize: 9999 })
})
</script>

<style lang="less" scoped>
.absoluteTxt {
  writing-mode: vertical-rl;
}
</style>
