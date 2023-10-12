<template>
  <div class="py-6">
    <div class="pl-4 leading-10" v-for="(item, index) in menuList" :key="index">
      <span class="text-gray-400">{{ item.title }}</span>
      <div
        class="pl-4 leading-7"
        v-if="item.children?.length"
        v-for="(ele, index) in item.children"
        :key="index"
      >
        <span
          :class="`cursor-pointer ${
            selectedKey == ele.name ? 'font-bold text-blue-400' : 'text-black'
          }`"
          @click="goto(ele)"
          >{{ ele.title }}</span
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineComponent, ref, h, resolveComponent, computed } from 'vue'
import { useRoute, useRouter, RouteRecordRaw } from 'vue-router'
import type { RouteMeta } from 'vue-router'
import { useAppStore } from '@renderer/store'
import { openWindow, regexUrl } from '@renderer/utils'

import { appRoutes, menuList, MenuType } from '@renderer/router/routes'

const appStore = useAppStore()
const router = useRouter()
const route = useRoute()

const currentKey = router.currentRoute.value.name || 'bookshelf'

const selectedKey = ref<string>(currentKey)

const goto = (item: MenuType) => {
  // Open external link
  if (selectedKey.value == item.name) return
  selectedKey.value = item.name
  console.log('goto selectedKey', selectedKey.value)

  if (regexUrl.test(item.path)) {
    openWindow(item.path)
  } else {
    router.push({ name: item.name })
  }
}
</script>

<style lang="less" scoped></style>
