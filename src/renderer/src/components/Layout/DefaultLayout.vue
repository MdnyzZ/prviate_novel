<template>
  <a-layout class="layout">
    <a-layout-sider>
      <div class="menu-wrapper">
        <Menu />
      </div>
    </a-layout-sider>
    <a-layout-content>
      <router-view></router-view>
    </a-layout-content>
  </a-layout>
</template>

<script lang="ts" setup>
import Menu from './components/Menu/index.vue';
</script>

<style scoped lang="less">
  @nav-size-height: 56px;
  @layout-max-width: 1100px;

  .layout {
    width: 100vw;
    height: 100vh;
  }
</style>
