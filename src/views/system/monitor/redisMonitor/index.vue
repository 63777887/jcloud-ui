<template>
  <div>
    <el-row :gutter="20" class="redis-info">
      <el-col :span="8">
        <el-card shadow="hover">
            <p>Redis版本</p>
            <h4 class="text-big">{{ redisInfo.redis_version }}</h4>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
            <p>客户端数量</p>
            <h4 class="text-big">{{ redisInfo.connected_clients }}</h4>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
            <p>运行天数</p>
            <h4 class="text-big">{{ Number(redisInfo.uptime_in_days) + 1 }}</h4>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
            <p>是否集群</p>
            <h4 class="text-big">{{ redisInfo.isCluster =='false'? '否' : '是' }}</h4>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
            <p>是否开启AOF</p>
            <h4 class="text-big">{{ redisInfo.aof_enabled == 0 ? '否' : '是' }}</h4>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
            <p>RDB快照的状态</p>
            <h4 class="text-big">{{ redisInfo.rdb_last_bgsave_status == 'ok' ? '正常' : '失败' }}</h4>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
            <p>执行命令数</p>
            <h4 class="text-big">{{ redisInfo.total_commands_processed }}</h4>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
            <p>数据集内存占比</p>
            <h4 class="text-big">{{ redisInfo.used_memory_dataset_perc }}</h4>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card shadow="hover">
            <p>服务器总内存</p>
            <h4 class="text-big">{{ formatDataSize(Number(redisInfo.total_system_memory), 'B') }}</h4>
        </el-card>
      </el-col>
    </el-row>
    <el-row  :gutter="20">
      <el-col :span="8">
        <el-card class="common-charts-box" shadow="never">
          <template #header>
            <div>
              <span class="text-big">命令分布统计</span>
            </div>
          </template>
          <div class="common-charts" ref="commandChartsRef"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="common-charts-box" shadow="never">
          <template #header>
            <div>
              <span class="text-big">key数量监控</span>
            </div>
          </template>
          <div class="common-charts" ref="keysChartsRef"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card class="common-charts-box" shadow="never">
          <template #header>
            <div>
              <span class="text-big">内存监控</span>
            </div>
          </template>
          <div class="common-charts" ref="memoryChartsRef"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import {
  nextTick,
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate, onDeactivated,
  onErrorCaptured,
  onMounted,
  onRenderTracked, onRenderTriggered,
  onUnmounted,
  onUpdated, reactive, ref, toRefs
} from "vue";
import {GetRedisInfoReq} from "@/api/acl/system";
import {GetRedisInfoResponseData, RedisInfo, RedisInfoData} from "@/api/acl/system/type.ts";
import {SUCCESS_CODE} from "@/api/base/type.ts";
import {ElMessage} from "element-plus";

import * as echarts from 'echarts';
import {convertToMB, formatDataSize} from "@/utils/sizeUtil.ts";


let redisInfo = reactive<RedisInfo>({
  redis_version: "",
  uptime_in_days: "",
  connected_clients: "",
  used_memory_rss: "",
  rdb_last_bgsave_status: "",
  aof_enabled: "",
  current_save_keys_total: "",
  total_system_memory: "",
  total_commands_processed: ""
})
let memoryChartsRef = ref()
let commandChartsRef = ref()
let keysChartsRef = ref()


const commandChartsInit = (data) => {
  let commandChart = echarts.init(commandChartsRef.value);
  let option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: '50%',
        data: data,
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
      }
    ]
  };

  commandChart.setOption(option);
}


const keysChartsInit = (data) => {
  let totalCount = 0
  data.forEach(item => {
    totalCount += item.value
  })
  let keysChart = echarts.init(keysChartsRef.value);
  let option: echarts.EChartsOption  = {
    title: {
      text: totalCount,
      left: 'center',
      top: 'center'
    },
    legend: {
      top: '5%',
      left: 'center',
      selectedMode: false
    },
    tooltip: {
      trigger: 'item'
    },
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false,
          position: 'center'
        },
        labelLine: {
          show: false
        },
        data: data
      }
    ]
  };

  keysChart.setOption(option);
}

const memoryChartsInit = () => {
  let memoryChart = echarts.init(memoryChartsRef.value);
  let option: echarts.EChartsOption = {
    tooltip: {
      formatter: '{a} <br/>{b} : {c}M'
    },
    series: [
      {
        name: 'redis内存',
        type: 'gauge',
        detail: {
          formatter: '{value}M'
        },
        data: [
          {
            value: convertToMB(redisInfo.used_memory_rss, 'B').toFixed(2),
            name: '内存消耗'
          }
        ]
      }
    ]
  };

  memoryChart.setOption(option);
}

onBeforeMount(() => {
}) // 生命周期 - 挂载之前
onMounted(async () => {
  // 获取redis info信息
  let redisInfoReq: GetRedisInfoResponseData = await GetRedisInfoReq();
  if (redisInfoReq.code != SUCCESS_CODE) {
    ElMessage.error("获取redis信息失败")
  } else {
    Object.assign(redisInfo, redisInfoReq.data.info)
    console.log(redisInfo)
  }
  console.log(redisInfoReq.data.command)

  memoryChartsInit();
  const commandData = Object.entries(redisInfoReq.data.command).map(([key, value]) => ({name: key, value: value}));
  // const commandData = Array.from(redisInfoReq.data.command.entries()).map(([key, value]) => ({ name: key, value: value }));

  commandChartsInit(commandData);
  const keysData = Object.entries(redisInfoReq.data.keys).map(([key, value]) => ({name: key, value: value}));
  keysChartsInit(keysData);
}) // 生命周期 - 挂载完成（可以访问 DOM 元素）
onBeforeUpdate(() => {
}) // 生命周期 - 更新之前
onUpdated(() => {
}) // 生命周期 - 更新之后
onBeforeUnmount(() => {
}) // 生命周期 - 销毁之前
onUnmounted(() => {
}) // 生命周期 - 销毁完成
onErrorCaptured((err) => {
}) // 当事件处理程序或生命周期钩子抛出错误时
onRenderTracked((e) => {
}) // 渲染的时候可以追踪到
onRenderTriggered((e) => {
}) // 重新渲染的时候触发
// 如果页面有 keep-alive 缓存功能,这个两个函数会触发
onActivated(() => {
}) // 进入的时候触发
onDeactivated(() => {
}) // 离开的时候触发
</script>

<style scoped lang="scss">
.redis-info{
  .el-col {
    padding: 8px;
    .el-card {
      background-color: rgb(239 246 255);
        transition: all 0.5s; //控制速度，也可不加

      p{
        color: rgb(75 85 99);
        font-weight: 500;
        font-size: 13px;
        padding-bottom: 7px;
      }
    }
    .el-card:hover {
      transform: scale(1.05); //放大倍数
    }
  }
}

.text-big{
  font-size: 18px;
  font-weight: 700;
}

.common-charts-box {
  border: none;

  :deep .el-card__header {
    border-bottom: none;
  }

  .common-charts {
    height: 500px;
    width: 500px;
  }
}

</style>
