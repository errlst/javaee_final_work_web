<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-left">
        <h2>欢迎使用</h2>
        <p>商品合同管理系统</p>
      </div>
      <div class="login-right">
        <h3>{{ isLogin ? '登录' : '注册' }}</h3>
        <el-form :model="form" class="login-form">
          <el-form-item>
            <el-input v-model="form.username" :prefix-icon="User" placeholder="请输入用户名" />
          </el-form-item>
          <el-form-item>
            <el-input v-model="form.password" :prefix-icon="Lock" type="password" placeholder="请输入密码" />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" class="submit-btn" @click="handleSubmit">
              {{ isLogin ? '登录' : '注册' }}
            </el-button>
          </el-form-item>

          <div class="form-footer">
            <span @click="isLogin = !isLogin">
              {{ isLogin ? '没有账号？立即注册' : '已有账号？立即登录' }}
            </span>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { login, register } from '../api'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

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
      router.push('/goods')
    } else {
      await register(form.value)
      ElMessage.success('注册成功')
      isLogin.value = true
    }
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-box {
  display: flex;
  width: 900px;
  height: 500px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 25px rgba(0, 0, 0, 0.1);
}

.login-left {
  flex: 1;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
}

.login-left h2 {
  font-size: 36px;
  margin-bottom: 10px;
  font-weight: 600;
}

.login-left p {
  font-size: 18px;
  opacity: 0.9;
}

.login-right {
  flex: 1;
  padding: 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.login-right h3 {
  font-size: 24px;
  margin-bottom: 30px;
  text-align: center;
  color: #333;
}

.login-form {
  width: 100%;
  max-width: 300px;
  margin: 0 auto;
}

.submit-btn {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border-radius: 8px;
  margin-top: 20px;
}

.form-footer {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.form-footer span {
  cursor: pointer;
  color: var(--el-color-primary);
}

.form-footer span:hover {
  text-decoration: underline;
}

:deep(.el-input__wrapper) {
  padding: 12px;
  border-radius: 8px;
}

:deep(.el-input__inner) {
  font-size: 14px;
}

:deep(.el-form-item) {
  margin-bottom: 20px;
}

@media (max-width: 768px) {
  .login-box {
    width: 90%;
    flex-direction: column;
    height: auto;
  }

  .login-left {
    padding: 30px;
  }

  .login-right {
    padding: 30px;
  }
}
</style>