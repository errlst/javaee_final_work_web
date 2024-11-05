<template>
    <div class="contract-container">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>合同管理</span>
            <div class="header-buttons">
              <el-button type="primary" @click="handleAdd">添加合同</el-button>
              <el-button type="success" @click="handleBatchAdd">批量添加</el-button>
            </div>
          </div>
        </template>
  
        <el-table :data="contractList" style="width: 100%">
          <el-table-column prop="id" label="ID" width="80" />
          <el-table-column prop="code" label="合同编号" width="220" />
          <el-table-column prop="type" label="合同类型">
            <template #default="scope">
              <el-tag :type="getContractTypeTag(scope.row.type)">
                {{ getContractTypeName(scope.row.type) }}
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="create_time" label="创建时间" width="180">
            <template #default="scope">
              {{ formatDate(scope.row.create_time) }}
            </template>
          </el-table-column>
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
        :title="form.id ? '编辑合同' : '添加合同'"
        width="500px"
      >
        <el-form :model="form" label-width="100px">
          <el-form-item label="合同类型">
            <el-select v-model="form.type" placeholder="请选择合同类型">
              <el-option label="销售合同" :value="1" />
              <el-option label="采购合同" :value="2" />
              <el-option label="服务合同" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="零售商ID">
            <el-input v-model="form.retailer_id" type="number" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleSubmit">确定</el-button>
          </span>
        </template>
      </el-dialog>
  
      <!-- 批量添加对话框 -->
      <el-dialog
        v-model="batchDialogVisible"
        title="批量添加合同"
        width="500px"
      >
        <el-form :model="batchForm" label-width="100px">
          <el-form-item label="合同类型">
            <el-select v-model="batchForm.type" placeholder="请选择合同类型">
              <el-option label="销售合同" :value="1" />
              <el-option label="采购合同" :value="2" />
              <el-option label="服务合同" :value="3" />
            </el-select>
          </el-form-item>
          <el-form-item label="零售商ID列表">
            <el-input
              v-model="batchForm.retailer_ids"
              type="textarea"
              placeholder="请输入零售商ID，多个ID用逗号分隔"
              rows="4"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="batchDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="handleBatchSubmit">确定</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { getContracts, addContract, updateContract, deleteContract } from '../api'
  import { ElMessage, ElMessageBox } from 'element-plus'
  
  const contractList = ref([])
  const currentPage = ref(1)
  const total = ref(0)
  const dialogVisible = ref(false)
  const batchDialogVisible = ref(false)
  
  const form = ref({
    id: '',
    type: 1,
    retailer_id: ''
  })
  
  const batchForm = ref({
    type: 1,
    retailer_ids: ''
  })
  
  // 获取合同类型名称
  const getContractTypeName = (type) => {
    const types = {
      1: '销售合同',
      2: '采购合同',
      3: '服务合同'
    }
    return types[type] || '未知类型'
  }
  
  // 获取合同类型对应的标签类型
  const getContractTypeTag = (type) => {
    const types = {
      1: 'success',
      2: 'warning',
      3: 'info'
    }
    return types[type] || ''
  }
  
  // 格式化日期
  const formatDate = (date) => {
    if (!date) return ''
    return new Date(date).toLocaleString()
  }
  
  const loadContracts = async () => {
    try {
      const res = await getContracts(currentPage.value)
      contractList.value = res.data.data
      total.value = res.data.total
    } catch (error) {
      ElMessage.error('获取合同列表失败')
    }
  }
  
  const handlePageChange = (page) => {
    currentPage.value = page
    loadContracts()
  }
  
  const handleAdd = () => {
    form.value = {
      id: '',
      type: 1,
      retailer_id: ''
    }
    dialogVisible.value = true
  }
  
  const handleBatchAdd = () => {
    batchForm.value = {
      type: 1,
      retailer_ids: ''
    }
    batchDialogVisible.value = true
  }
  
  const handleEdit = (row) => {
    form.value = { ...row }
    dialogVisible.value = true
  }
  
  const handleDelete = async (row) => {
    try {
      await ElMessageBox.confirm('确定要删除该合同吗？')
      await deleteContract({ id: row.id })
      ElMessage.success('删除成功')
      loadContracts()
    } catch (error) {
      if (error !== 'cancel') {
        ElMessage.error('删除失败')
      }
    }
  }
  
  const handleSubmit = async () => {
    try {
      if (form.value.id) {
        await updateContract(form.value)
      } else {
        await addContract(form.value)
      }
      ElMessage.success('操作成功')
      dialogVisible.value = false
      loadContracts()
    } catch (error) {
      ElMessage.error('操作失败')
    }
  }
  
  const handleBatchSubmit = async () => {
    try {
      const retailer_ids = batchForm.value.retailer_ids
        .split(',')
        .map(id => parseInt(id.trim()))
        .filter(id => !isNaN(id))
  
      if (retailer_ids.length === 0) {
        ElMessage.warning('请输入有效的零售商ID')
        return
      }
  
      await addContract({
        type: batchForm.value.type,
        retailer_ids
      })
      
      ElMessage.success('批量添加成功')
      batchDialogVisible.value = false
      loadContracts()
    } catch (error) {
      ElMessage.error('批量添加失败')
    }
  }
  
  onMounted(() => {
    loadContracts()
  })
  </script>
  
  <style scoped>
  .contract-container {
    padding: 20px;
  }
  
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .header-buttons {
    display: flex;
    gap: 10px;
  }
  
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
  </style>