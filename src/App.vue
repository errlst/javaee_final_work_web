<template>
  <el-config-provider>
    <RouterView />
  </el-config-provider>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<style>
html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
