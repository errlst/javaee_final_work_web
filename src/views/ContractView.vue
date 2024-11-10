<template>
    <div class="contract-container">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>合同管理</span>
          </div>
        </template>
  
        <el-table :data="contractList" style="width: 100%">
          <el-table-column prop="id" label="合同ID" width="80" />
          <el-table-column prop="code" label="合同代码" />
          <el-table-column label="货物名称">
            <template #default="scope">
              {{ getGoodsName(scope.row.goodsId) }}
            </template>
          </el-table-column>
          <el-table-column label="供应商名称">
            <template #default="scope">
              {{ getRetailerName(scope.row.retailer_id) }}
            </template>
          </el-table-column>
          <el-table-column label="创建时间">
            <template #default="scope">
              {{ formatDate(scope.row.create_time) }}
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" width="100">
            <template #default="scope">
              <el-button type="danger" size="small" @click="handleDelete(scope.row)">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <div class="pagination">
          <el-pagination
            v-model:current-page="currentPage"
            :page-size="1"
            :total="total"
            layout="total, prev, pager, next, jumper"
            @current-change="handlePageChange"
          />
        </div>
      </el-card>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { getContracts, getContractPages, getAllRetailers, getGoods, deleteContract } from '../api'
  
  const contractList = ref([])
  const currentPage = ref(1)
  const total = ref(0)
  const totalPages = ref(0)
  
  // 存储商品和供应商信息的映射
  const goodsMap = ref(new Map())
  const retailerMap = ref(new Map())
  
  // 加载商品和供应商信息
  const loadRelatedData = async () => {
    try {
      // 获取所有商品和供应商信息
      const [goodsResponse, retailerResponse] = await Promise.all([
        getGoods(1), // 获取第一页商品
        getAllRetailers()
      ])
  
      if (goodsResponse.data.code === 200) {
        // 正确获取商品数据
        goodsMap.value.clear()
        goodsResponse.data.data.forEach(item => {
          goodsMap.value.set(item.id, item)
        })
      }
  
      if (retailerResponse.data.code === 200) {
        // 正确获取供应商数据
        retailerMap.value.clear()
        retailerResponse.data.data.forEach(item => {
          retailerMap.value.set(item.id, item)
        })
      }
  
      console.log('商品映射:', goodsMap.value)
      console.log('供应商映射:', retailerMap.value)
    } catch (error) {
      console.error('加载关联数据失败:', error)
      ElMessage.error('加载商品和供应商信息失败')
    }
  }
  
  // 加载合同列表
  const loadContracts = async () => {
    try {
      // 先加载关联数据
      await loadRelatedData()
  
      const [contractResponse, pagesResponse] = await Promise.all([
        getContracts(currentPage.value),
        getContractPages()
      ])
  
      if (contractResponse.data.code === 200 && pagesResponse.data.code === 200) {
        contractList.value = contractResponse.data.data
        totalPages.value = pagesResponse.data.data
        total.value = totalPages.value
      } else {
        contractList.value = []
        total.value = 0
        totalPages.value = 0
        ElMessage.warning(contractResponse.data.info || '获取数据异常')
      }
    } catch (error) {
      console.error('加载合同列表失败:', error)
      ElMessage.error('获取合同列表失败')
      contractList.value = []
      total.value = 0
      totalPages.value = 0
    }
  }
  
  // 格式化日期
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }
  
  // 获取商品名称
  const getGoodsName = (goodsId) => {
    const goods = goodsMap.value.get(goodsId)
    return goods ? goods.name : '-'
  }
  
  // 获取供应商名称
  const getRetailerName = (retailerId) => {
    const retailer = retailerMap.value.get(retailerId)
    return retailer ? retailer.name : '-'
  }
  
  // 删除合同
  const handleDelete = async (row) => {
    try {
      await ElMessageBox.confirm(
        `确定要删除合同 ${row.code} 吗？`,
        '警告',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
      
      // 直接传递数据对象，不要包装在 id 字段中
      const response = await deleteContract({
        id: row.id,
        goodsId: row.goodsId,
        retailer_id: row.retailer_id
      })
      
      if (response.data.code === 200) {
        ElMessage.success('删除成功')
        await loadContracts() // 重新加载数据
      } else {
        ElMessage.error(response.data.info || '删除失败')
      }
    } catch (error) {
      if (error !== 'cancel') {
        console.error('删除合同失败:', error)
        ElMessage.error('删除失败')
      }
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
  
  .pagination {
    margin-top: 20px;
    text-align: right;
  }
  </style>