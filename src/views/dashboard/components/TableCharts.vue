<template>
  <el-row>
    <el-col :span="24">
      <div ref="trendChart" class="chart" />
    </el-col>
  </el-row>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import * as echarts from 'echarts'

// const shareChart = ref(null)
// const detailChart = ref(null)
const trendChart = ref(null)

onMounted(() => {
  const myTrendChart = echarts.init(trendChart.value)
  myTrendChart.setOption({
    title: { text: '模型准确度' },
    legend: {},
    tooltip: {},
    xAxis: { type: 'category', data: ['1', '2', '3', '4', '5', '6', '7'] },
    yAxis: { type: 'value' },
    series: [{ data: [12, 13, 15, 17, 21, 25, 24], type: 'line' }]
  })

  window.onresize = function () {
    // myShareChart.resize()
    // myDetailChart.resize()
    myTrendChart.resize()
  }
})
</script>

<style scoped lang="scss">
.chart {
  min-height: 300px;
  color: var(--ea-main-text-color);
  background-color: var(--ea-main-color);
}
</style>
