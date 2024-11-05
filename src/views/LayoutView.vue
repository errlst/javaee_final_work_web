<template>
    <el-container class="layout-container">
      <el-aside width="200px">
        <el-menu
          router
          :default-active="route.path"
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
          <div class="header-right">
            <el-dropdown @command="handleCommand">
              <span class="el-dropdown-link">
                {{ username }}
                <el-icon class="el-icon--right"><arrow-down /></el-icon>
              </span>
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
  import { ref } from 'vue'
  
  const route = useRoute()
  const router = useRouter()
  const username = ref('管理员')
  
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
  
  .el-header {
    background-color: #fff;
    border-bottom: 1px solid #dcdfe6;
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding: 0 20px;
  }
  
  .el-aside {
    background-color: #304156;
  }
  
  .el-menu {
    border-right: none;
  }
  
  .header-right {
    cursor: pointer;
  }
  </style>