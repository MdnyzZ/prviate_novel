<template>
  <div class="flex justify-start flex-wrap items-center">
    <div
      class="flex flex-col justify-center cursor-pointer rounded-md mr-6 overflow-hidden hover:shadow-lg"
      v-for="(item, index) in books"
      :key="index"
      @click="goDetail(item)"
    >
      <a-image width="120" height="150" fit="cover" :preview="false" :src="item.coverImage" />
      <span class="text-center leading-8 text-gray-800">{{ item.title }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

interface booksListType {
  // 标题
  title?: string
  // 描述
  descrtion?: string
  // 作者
  author?: string
  // 更新时间
  updatedTime?: string
  // 最新章节
  latestChapter?: string
  // 封面
  coverImage?: string
  // 本地路径
  localPath?: string
  // 原网页路径
  networkPath?: string
  // 小说类型
  pathType?: 'local' | 'network'
  // 解析规则
  parsingRules?: any
}

const books = ref<booksListType[]>([
  {
    title: '遮天',
    author: '辰东',
    coverImage:
      'https://t8.baidu.com/it/u=3930098652,1002645705&fm=218&app=126&size=f242,150&n=0&f=JPEG&fmt=auto?s=3C0BEE1759C144C25575ADED0300503C&sec=1697216400&t=981e06a396cdfa3ea6da5c3c4f29acb8',
    latestChapter: '第1222章 北玄突破仙帝',
    updatedTime: '2022-11-11',
    descrtion: '333333333333333333333'
  },
  {
    title: '遮天',
    author: '辰东',
    coverImage:
      'https://t8.baidu.com/it/u=3930098652,1002645705&fm=218&app=126&size=f242,150&n=0&f=JPEG&fmt=auto?s=3C0BEE1759C144C25575ADED0300503C&sec=1697216400&t=981e06a396cdfa3ea6da5c3c4f29acb8',
    latestChapter: '第1222章 北玄突破仙帝',
    updatedTime: '2022-11-11',
    descrtion: '333333333333333333333'
  }
])

const goDetail = (book: booksListType) => {
  console.log('book', book)
  // todo 跳转到阅读页面
  router.push({
    name: 'bookDetails'
  })
}
</script>
