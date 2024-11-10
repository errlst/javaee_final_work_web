<template>
  <el-container class="layout-container">
    <el-aside width="240px">
      <div class="logo">
        <span>管理系统</span>
      </div>
      <el-menu
        router
        :default-active="currentPath"
        class="el-menu-vertical"
      >
        <el-menu-item index="/goods">
          <el-icon><Goods /></el-icon>
          <span>商品管理</span>
        </el-menu-item>
        <el-menu-item index="/contract">
          <el-icon><Document /></el-icon>
          <span>合同管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container>
      <el-header>
        <div class="header-content">
          <div class="breadcrumb">
            {{ currentRouteName }}
          </div>
          <el-dropdown @command="handleCommand">
            <div class="user-info">
              <el-avatar :size="32">A</el-avatar>
              <span>{{ username }}</span>
              <el-icon><ArrowDown /></el-icon>
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed } from 'vue'
import { Document, Goods, ArrowDown } from '@element-plus/icons-vue'

const route = useRoute()
const router = useRouter()
const username = ref('管理员')

// 计算当前路径
const currentPath = computed(() => route.path)

// 计算当前路由名称
const currentRouteName = computed(() => {
  switch (route.path) {
    case '/goods':
      return '商品管理'
    case '/contract':
      return '合同管理'
    default:
      return ''
  }
})

const handleCommand = (command) => {
  if (command === 'logout') {
    router.push('/login')
  }
}
</script>

<style scoped>
.layout-container {
  height: 100vh;
}

.logo {
  height: 64px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  color: var(--primary-color);
  font-size: 18px;
  font-weight: bold;
}

.el-header {
  background-color: var(--card-background);
  border-bottom: 1px solid var(--border-color);
  height: 64px;
}

.header-content {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.el-main {
  padding: 24px;
  background-color: var(--background-color);
}

.el-aside {
  background-color: var(--card-background);
  border-right: 1px solid var(--border-color);
}

.breadcrumb {
  font-size: 16px;
  color: var(--text-primary);
}
</style>