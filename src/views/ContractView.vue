<template>
  <div class="page-container">
    <div class="page-header">
      <h2>合同管理</h2>
    </div>

    <el-card class="data-card">
      <el-table :data="contractList" style="width: 100%" :header-cell-style="{
        background: '#f8fafc',
        color: '#475569'
      }">
        <el-table-column label="合同编号" min-width="280">
          <template #default="{ row }">
            <span class="contract-code">{{ row.code }}</span>
          </template>
        </el-table-column>

        <el-table-column label="商品名称" min-width="180">
          <template #default="{ row }">
            <span class="goods-name">{{ goodsMap.get(row.goodsId)?.name || '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="供应商" min-width="180">
          <template #default="{ row }">
            <span class="retailer-name">
              {{ retailerMap.get(row.retailer_id)?.name || '-' }}
            </span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="100" fixed="right">
          <template #default="{ row }">
            <el-button type="danger" link @click="handleDelete(row)">
              <el-icon>
                <Delete />
              </el-icon>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container">
        <el-pagination v-model:current-page="currentPage" :page-size="10" :total="total"
          @current-change="handlePageChange" layout="total, prev, pager, next" background />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  getContracts,
  getContractPages,
  deleteContract,
  getAllRetailers,
  getGoods
} from '../api'
import { ElMessage, ElMessageBox } from 'element-plus'
import { Delete } from '@element-plus/icons-vue'

const contractList = ref([])
const currentPage = ref(1)
const total = ref(0)
const totalPages = ref(0)
const goodsMap = ref(new Map())
const retailerMap = ref(new Map())

// 加载关联数据
const loadRelatedData = async () => {
  try {
    const [goodsResponse, retailerResponse] = await Promise.all([
      getGoods(1),
      getAllRetailers()
    ])

    if (goodsResponse.data.code === 200) {
      goodsMap.value.clear()
      goodsResponse.data.data.forEach(item => {
        goodsMap.value.set(item.id, item)
      })
    }

    if (retailerResponse.data.code === 200) {
      retailerMap.value.clear()
      retailerResponse.data.data.forEach(item => {
        retailerMap.value.set(item.id, item)
      })
    }
  } catch (error) {
    console.error('加载关联数据失败:', error)
    ElMessage.error('加载商品和供应商信息失败')
  }
}

// 加载合同列表
const loadContracts = async () => {
  try {
    await loadRelatedData()

    const [contractResponse, pagesResponse] = await Promise.all([
      getContracts(currentPage.value),
      getContractPages()
    ])

    if (contractResponse.data.code === 200 && pagesResponse.data.code === 200) {
      contractList.value = contractResponse.data.data
      totalPages.value = pagesResponse.data.data
      total.value = pagesResponse.data.data
    } else {
      contractList.value = []
      total.value = 0
      totalPages.value = 0
    }
  } catch (error) {
    console.error('加载合同列表失败:', error)
    ElMessage.error('加载合同列表失败')
  }
}

// 页码变化处理
const handlePageChange = (newPage) => {
  currentPage.value = newPage
  loadContracts()
}

// 删除合同
const handleDelete = (row) => {
  ElMessageBox.confirm('确定要删除这个合同吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      await deleteContract({ id: row.id })
      ElMessage.success('删除成功')
      await loadContracts()
    } catch (error) {
      console.error('删除失败:', error)
      ElMessage.error('删除失败')
    }
  })
}

onMounted(() => {
  loadContracts()
})
</script>

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

.contract-code {
  font-family: 'Roboto Mono', monospace;
  color: #6366f1;
  font-size: 13px;
}

.goods-name {
  color: #1e293b;
  font-weight: 500;
}

.retailer-name {
  color: #1e293b;
}

.pagination-container {
  margin-top: 24px;
  display: flex;
  justify-content: flex-end;
}
</style>