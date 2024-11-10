<template>
  <div class="page-container">
    <div class="page-header">
      <h2>商品管理</h2>
      <el-button type="primary" @click="handleAdd">
        <el-icon><Plus /></el-icon>添加商品
      </el-button>
    </div>

    <el-card class="data-card">
      <el-table 
        :data="goodsList" 
        style="width: 100%"
        :header-cell-style="{
          background: '#f8fafc',
          color: '#475569'
        }"
      >
        <el-table-column prop="name" label="商品名称" min-width="180">
          <template #default="{ row }">
            <span class="goods-name">{{ row.name }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="price" label="价格" width="120">
          <template #default="{ row }">
            <span class="price">¥{{ row.price }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="locality" label="产地" width="150" />
        
        <el-table-column label="供应商" min-width="200">
          <template #default="{ row }">
            <div class="retailer-tags">
              <el-tag
                v-for="retailer in getSelectedRetailers(row.id)"
                :key="retailer.id"
                type="success"
                effect="light"
                class="retailer-tag"
              >
                {{ retailer.name }}
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="150" fixed="right">
          <template #default="{ row }">
            <div class="action-buttons">
              <el-button type="primary" link @click="handleEdit(row)">
                <el-icon><Edit /></el-icon>编辑
              </el-button>
              <el-button type="danger" link @click="handleDelete(row)">
                <el-icon><Delete /></el-icon>删除
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="10"
          :total="total"
          @current-change="handlePageChange"
          layout="total, prev, pager, next"
          background
        />
      </div>
    </el-card>

    <!-- 编辑/添加对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="editingItem ? '编辑商品' : '添加商品'"
      width="500px"
      destroy-on-close
    >
      <el-form :model="form" label-width="80px">
        <el-form-item label="商品名称" required>
          <el-input v-model="form.name" placeholder="请输入商品名称" />
        </el-form-item>
        
        <el-form-item label="价格" required>
          <el-input-number 
            v-model="form.price" 
            :min="0" 
            :precision="2"
            :step="0.1"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="产地" required>
          <el-input v-model="form.locality" placeholder="请输入产地" />
        </el-form-item>

        <el-form-item v-if="editingItem" label="供应商">
          <div class="retailers-container">
            <el-checkbox-group v-model="form.retailerIds">
              <div 
                v-for="retailer in currentGoodsRetailers" 
                :key="retailer.id"
                class="retailer-item"
              >
                <el-checkbox :label="retailer.id">
                  <div class="retailer-info">
                    <span class="retailer-name">{{ retailer.name }}</span>
                    <span class="retailer-detail">{{ retailer.phone }}</span>
                  </div>
                </el-checkbox>
              </div>
            </el-checkbox-group>
          </div>
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确认</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100%;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.page-header h2 {
  margin: 0;
  font-size: 24px;
  color: #1e293b;
}

.data-card {
  background: #fff;
  border-radius: 12px;
}

.goods-name {
  font-weight: 500;
  color: #1e293b;
}

.price {
  font-family: 'Roboto Mono', monospace;
  color: #059669;
  font-weight: 500;
}

.retailer-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.retailer-tag {
  border-radius: 4px;
  font-size: 12px;
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.pagination-container {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}

.checkbox-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

:deep(.el-dialog) {
  border-radius: 12px;
}

:deep(.el-dialog__header) {
  margin-right: 0;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

:deep(.el-dialog__body) {
  padding: 24px;
}

:deep(.el-dialog__footer) {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.retailers-container {
  max-height: 300px;
  overflow-y: auto;
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.retailer-item {
  padding: 8px;
  border-radius: 6px;
  transition: background-color 0.2s;
}

.retailer-item:hover {
  background-color: #f8fafc;
}

.retailer-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-left: 8px;
}

.retailer-name {
  font-weight: 500;
  color: #1e293b;
}

.retailer-detail {
  font-size: 12px;
  color: #64748b;
}

:deep(.el-checkbox__label) {
  padding-left: 8px;
}

:deep(.el-checkbox) {
  width: 100%;
  margin-right: 0;
  margin-bottom: 4px;
}

:deep(.el-checkbox:last-child) {
  margin-bottom: 0;
}
</style>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getGoods, addGoods, updateGoods, deleteGoods, getGoodsPages, getGoodsRetailers, getAllRetailers, updateRetailers } from '../api'
import { 
  Plus, 
  Edit, 
  Delete 
} from '@element-plus/icons-vue'

const goodsList = ref([])
const currentPage = ref(1)
const total = ref(0)
const dialogVisible = ref(false)
const editingItem = ref(null)
const form = ref({
  name: '',
  price: 0,
  locality: '',
  retailerIds: []
})

const totalPages = ref(0)
const retailers = ref([])

// 添加一个新的变量存储当前编辑商品的供应商
const currentGoodsRetailers = ref([])

// 存储所有供应商信息
const loadAllRetailers = async () => {
  try {
    const response = await getAllRetailers()
    if (response.data.code === 200) {
      retailers.value = response.data.data
    }
  } catch (error) {
    console.error('加载供应商信息失败:', error)
    ElMessage.error('加载供应商信息失败')
  }
}

// 获取商品的供应商名称
const getGoodsRetailerNames = (goodsId) => {
  const goodsRetailers = retailers.value.filter(r => r.goodsId === goodsId)
  return goodsRetailers.length > 0
    ? goodsRetailers.map(r => r.name).join(', ')
    : '-'
}

const loadGoods = async () => {
  try {
    const [goodsResponse, pagesResponse] = await Promise.all([
      getGoods(currentPage.value),
      getGoodsPages()
    ])

    if (goodsResponse.data.code === 200 && pagesResponse.data.code === 200) {
      goodsList.value = goodsResponse.data.data
      totalPages.value = pagesResponse.data.data
      total.value = totalPages.value

      // 加载供应商信息
      await loadAllRetailers()
    } else {
      goodsList.value = []
      total.value = 0
      totalPages.value = 0
      ElMessage.warning(goodsResponse.data.info || '获取数据异常')
    }
  } catch (error) {
    console.error('加载商品列表失败:', error)
    ElMessage.error('获取商品列表失败')
    goodsList.value = []
    total.value = 0
    totalPages.value = 0
  }
}

const handlePageChange = async (page) => {
  currentPage.value = page
  await loadGoods()
}

const handleAdd = () => {
  editingItem.value = null
  form.value = {
    name: '',
    price: 0,
    locality: '',
    retailerIds: []
  }
  // 清空当前商品的供应商列表
  currentGoodsRetailers.value = []
  dialogVisible.value = true
}

const handleEdit = async (row) => {
  editingItem.value = row
  try {
    const response = await getGoodsRetailers(row.id)
    if (response.data.code === 200) {
      currentGoodsRetailers.value = response.data.data
      form.value = {
        name: row.name,
        price: row.price,
        locality: row.locality,
        retailerIds: currentGoodsRetailers.value
          .filter(retailer => retailer.status === 1)
          .map(retailer => retailer.id)
      }
    } else {
      ElMessage.warning(response.data.info || '获取供应商数据失败')
    }
  } catch (error) {
    console.error('获取供应商失败:', error)
    ElMessage.error('获取供应商数据失败')
  }
  dialogVisible.value = true
}

const handleDelete = async (row) => {
  try {
    await deleteGoods({ id: row.id })
    ElMessage.success('删除成功')
    await loadGoods() // 重新加载商品和供应商信息
  } catch (error) {
    ElMessage.error('删除失败')
  }
}

const handleSubmit = async () => {
  try {
    if (editingItem.value) {
      // 1. 更新商品基本信息
      const goodsData = {
        id: editingItem.value.id,
        name: form.value.name,
        price: form.value.price,
        locality: form.value.locality
      }
      await updateGoods(goodsData)

      // 2. 构建供应商更新数据
      const retailerData = currentGoodsRetailers.value.map(retailer => ({
        id: retailer.id,
        status: form.value.retailerIds.includes(retailer.id) ? 1 : 0,
        goodsId: editingItem.value.id
      }))
      
      // 3. 批量更新供应商状态
      await updateRetailers(retailerData)

      ElMessage.success('更新成功')
    } else {
      // 新增商品时只传递基本信息
      const goodsData = {
        name: form.value.name,
        price: form.value.price,
        locality: form.value.locality
      }
      await addGoods(goodsData)
      ElMessage.success('添加成功')
    }
    
    dialogVisible.value = false
    await loadGoods() // 重新加载数据
  } catch (error) {
    console.error('操作失败:', error)
    ElMessage.error('操作失败')
  }
}

// 添加一个方法来获取商品的已选供应商
const getSelectedRetailers = (goodsId) => {
  return retailers.value.filter(retailer => 
    retailer.goodsId === goodsId && retailer.status === 1
  )
}

onMounted(() => {
  loadGoods()
})
</script>