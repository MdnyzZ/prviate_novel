<template>
  <header class="border-b mb-6 pb-2 pr-2 overflow-hidden">
    <!-- 默认展示 -->
    <a-space class="float-right" v-if="!state.isEdit">
      <!-- 导入书籍 -->
      <a-tooltip content="导入书籍">
        <a-button :loading="state.loading.import" type="outline" size="mini" @click="importBookFn">
          <icon-plus />
        </a-button>
      </a-tooltip>

      <a-button v-if="state.books.length" type="outline" size="mini" @click="setEditStatus">
        <icon-edit />
      </a-button>
    </a-space>

    <!-- 选中编辑后的展示 -->
    <a-space v-if="state.isEdit" class="float-right">
      <a-button type="outline" size="mini" @click="setEditStatus"> 取消 </a-button>
      <a-button type="primary" size="mini" @click="deleteConfirm" :loading="state.loading.del">
        删除
      </a-button>
    </a-space>
  </header>

  <a-spin class="minFull" dot :loading="state.loading.load">
    <div class="minFull booklistCtn">
      <div
        class="w-28 relative flex flex-col justify-center cursor-pointer rounded-md overflow-hidden hover:shadow-lg"
        v-for="item in state.books"
        :key="item.id"
        @click="goDetail(item)"
      >
        <div
          v-if="state.isEdit"
          class="absolute top-0 left-0 w-full h-full z-20 pl-2 pt-2"
          @click.stop="setEditChooseed(item.id)"
        >
          <a-checkbox v-model="state.editChooseed[item.id]" class="pl-0"></a-checkbox>
        </div>
        <a-image
          width="100%"
          height="140"
          fit="fill"
          :preview="false"
          :src="item.image || defaultCoverImg"
        />
        <span
          class="w-28 text-center leading-8 px-2 text-gray-800 overflow-ellipsis overflow-hidden whitespace-nowrap"
        >
          {{ item.title }}
        </span>
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
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { Message } from '@arco-design/web-vue'
import { getBookListApi, addBookApi, deleteBookApi } from '@renderer/api/index'
import { bookListType } from '@commonTypes/apiTypes'
import defaultCoverImg from '@renderer/assets/image/default_cover_img.jpeg'
import { reduce } from 'lodash'
import { Modal } from '@arco-design/web-vue'

const router = useRouter()
const state = reactive<{
  books: bookListType[]
  loading: Record<string, boolean>
  isEdit: boolean
  editChooseed: Record<number, boolean>
}>({
  books: [],
  loading: {
    import: false,
    load: false
  },
  isEdit: false,
  editChooseed: {}
})
// 跳转到阅读页面
const goDetail = (book: bookListType) => {
  router.push({
    name: 'bookDetails',
    query: {
      ...book
    }
  })
}

const getList = async ({ page = 1, pageSize = 10 }) => {
  state.loading.load = true
  const result = await getBookListApi({
    page,
    pageSize
  })

  state.loading.load = false
  if (result.success && result?.data?.list) state.books = result.data.list
}

const importBookFn = async () => {
  state.loading.import = true
  const result = await addBookApi()
  state.loading.import = false
  if (result.success) {
    Message.success('导入书籍成功')
    getList({ page: 1, pageSize: 9999 })
  }
}

const setEditStatus = () => {
  state.isEdit = !state.isEdit
  if (!state.isEdit) state.editChooseed = {}
}

const setEditChooseed = (id, boolean = undefined) => {
  state.editChooseed[id] = boolean === undefined ? !state.editChooseed[id] : boolean
}

const deleteConfirm = (): void => {
  const ids: string =
    reduce(
      state.editChooseed,
      (result, value, key) => {
        if (value) result.push(key)
        return result
      },
      []
    ).join(',') || ''
  if (!ids.length) {
    Message.warning('未选择书籍')
    return
  }
  Modal.warning({
    title: '提示',
    content: '是否确认删除选中数据？',
    onOk: async () => {
      state.loading.del = true
      const result = await deleteBookApi(ids)
      if (result.success) {
        Message.success('删除成功')
        state.editChooseed = {}
        setEditStatus()
        getList({ page: 1, pageSize: 9999 })
      }
      state.loading.del = false
    }
  })
}

onMounted(() => {
  getList({ page: 1, pageSize: 9999 })
})
</script>

<style lang="less" scoped>
.absoluteTxt {
  writing-mode: vertical-rl;
}
.minFull {
  min-width: 100%;
  min-height: 100%;
}

.booklistCtn {
  display: grid;
  justify-content: space-between;
  grid-template-columns: repeat(auto-fill, 112px);
  grid-template-rows: repeat(auto-fill, 172px);
  grid-gap: 20px;
  justify-items: center;
  align-items: center;
}
</style>
