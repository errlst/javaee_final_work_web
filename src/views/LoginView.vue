<template>
  <div class="login-container">
    <el-card class="login-card">
      <template #header>
        <div class="card-header">
          <span>{{ isLogin ? '登录' : '注册' }}</span>
        </div>
      </template>

      <el-form :model="form" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="form.password" type="password" />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" @click="handleSubmit">
            {{ isLogin ? '登录' : '注册' }}
          </el-button>
          <el-button @click="isLogin = !isLogin">
            切换到{{ isLogin ? '注册' : '登录' }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, register } from '../api'
import { ElMessage } from 'element-plus'

const router = useRouter()
const isLogin = ref(true)
const form = ref({
  username: '',
  password: ''
})

const handleSubmit = async () => {
  try {
    if (isLogin.value) {
      await login(form.value)
      ElMessage.success('登录成功')
    } else {
      await register(form.value)
      ElMessage.success('注册成功')
      isLogin.value = true
      return
    }
    router.push('/goods')
  } catch (error) {
    ElMessage.error(error.response?.data?.message || '操作失败')
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f5f5f5;
}

.login-card {
  width: 400px;
}
</style>