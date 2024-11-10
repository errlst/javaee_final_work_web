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
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="商品名称" />
        <el-table-column prop="price" label="价格">
          <template #default="scope">
            ¥{{ scope.row.price.toFixed(2) }}
          </template>
        </el-table-column>
        <el-table-column prop="locality" label="产地" />
        <el-table-column label="供应商">
          <template #default="scope">
            {{ getGoodsRetailerNames(scope.row.id) }}
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="180">
          <template #default="scope">
            <el-button type="primary" size="small" @click="handleEdit(scope.row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(scope.row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination v-model:current-page="currentPage" :page-size="1" :total="total"
          layout="total, prev, pager, next, jumper" @current-change="handlePageChange" />
      </div>
    </el-card>

    <!-- 添加/编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="editingItem ? '编辑商品' : '添加商品'" width="500px">
      <el-form :model="form" label-width="80px">
        <el-form-item label="商品名称">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="价格">
          <el-input-number v-model="form.price" :min="0" />
        </el-form-item>
        <el-form-item label="产地">
          <el-input v-model="form.locality" />
        </el-form-item>
        <el-form-item v-if="editingItem" label="供应商">
          <el-checkbox-group v-model="form.retailerIds">
            <el-checkbox v-for="retailer in currentGoodsRetailers" :key="retailer.id" :label="retailer.id">
              {{ retailer.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确认</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getGoods, addGoods, updateGoods, deleteGoods, getGoodsPages, getGoodsRetailers, getAllRetailers, updateRetailers } from '../api'

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
  // 加载当前商品的供应商
  try {
    const response = await getGoodsRetailers(row.id)
    if (response.data.code === 200) {
      // 使用currentGoodsRetailers存储当前商品的供应商
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

      // 2. 更新供应商信息
      const retailerData = retailers.value.map(retailer => ({
        id: retailer.id,
        status: form.value.retailerIds.includes(retailer.id) ? 1 : 0,
        goodsId: editingItem.value.id
      }))
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

.retailer-text {
  cursor: pointer;
  color: #409EFF;
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.retailer-text .el-icon {
  font-size: 14px;
}
</style>