<template>
    <div class="goods-container">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>商品管理</span>
            <el-button type="primary" @click="handleAdd">添加商品</el-button>
          </div>
        </template>
  
        <el-table :data="goodsList" style="width: 100%">
          <el-table-column prop="id" label="ID" width="180" />
          <el-table-column prop="name" label="商品名称" />
          <el-table-column prop="price" label="价格" />
          <el-table-column prop="stock" label="库存" />
          <el-table-column fixed="right" label="操作" width="180">
            <template #default="scope">
              <el-button @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="danger" @click="handleDelete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="10"
            layout="prev, pager, next"
            :total="total"
            @current-change="handlePageChange"
          />
        </div>
      </el-card>
  
      <!-- 编辑/添加对话框 -->
      <el-dialog
        v-model="dialogVisible"
        :title="form.id ? '编辑商品' : '添加商品'"
        width="500px"
      >
        <el-form :model="form" label-width="80px">
          <el-form-item label="商品名称">
            <el-input v-model="form.name" />
          </el-form-item>
          <el-form-item label="价格">
            <el-input-number v-model="form.price" :precision="2" />
          </el-form-item>
          <el-form-item label="库存">
            <el-input-number v-model="form.stock" :precision="0" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { getGoods, addGoods, updateGoods, deleteGoods } from '../api'
  import { ElMessage, ElMessageBox } from 'element-plus'
  
  const goodsList = ref([])
  const currentPage = ref(1)
  const total = ref(0)
  const dialogVisible = ref(false)
  const form = ref({
    id: '',
    name: '',
    price: 0,
    stock: 0
  })
  
  const loadGoods = async () => {
    try {
      const res = await getGoods(currentPage.value)
      goodsList.value = res.data.data
      total.value = res.data.total
    } catch (error) {
      ElMessage.error('获取商品列表失败')
    }
  }
  
  const handlePageChange = (page) => {
    currentPage.value = page
    loadGoods()
  }
  
  const handleAdd = () => {
    form.value = {
      id: '',
      name: '',
      price: 0,
      stock: 0
    }
    dialogVisible.value = true
  }
  
  const handleEdit = (row) => {
    form.value = { ...row }
    dialogVisible.value = true
  }
  
  const handleDelete = async (row) => {
    try {
      await ElMessageBox.confirm('确定要删除该商品吗？')
      await deleteGoods({ id: row.id })
      ElMessage.success('删除成功')
      loadGoods()
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('删除失败')
      }
    }
  }
  
  const handleSubmit = async () => {
    try {
      if (form.value.id) {
        await updateGoods(form.value)
      } else {
        await addGoods(form.value)
      }
      ElMessage.success('操作成功')
      dialogVisible.value = false
      loadGoods()
    } catch (error) {
      ElMessage.error('操作失败')
    }
  }
  
  onMounted(() => {
    loadGoods()
  })
  </script>
  
  <style scoped>
  .goods-container {
    padding: 20px;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
  </style>