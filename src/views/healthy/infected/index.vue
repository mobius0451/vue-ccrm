<template>

  <div v-loading="loading">
    <el-card class="main-contain" v-for="(item, index) in data" :key="index" v-if="total > 0">
      <el-descriptions title="感染信息">
        <el-descriptions-item label="感染人"> {{ item.createBy }} </el-descriptions-item>
        <el-descriptions-item label="感染持续时间/天"> {{ item.infectedSpan }} </el-descriptions-item>
        <el-descriptions-item label="感染期间最高体温/°C"> {{ item.maxTemperature }} </el-descriptions-item>
        <el-descriptions-item label="感染时间"> {{ item.infectedTime }} </el-descriptions-item>
        <el-descriptions-item label="康复时间"> {{ item.recoveryTime }} </el-descriptions-item>
        <el-descriptions-item label="状态">
            <my-tag :options="status" :value="item.status"/>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-empty :image-size="200" v-if="total == 0"></el-empty>
  </div>

</template>

<script>
import { listInfected } from '@/api/healthy/infected'

export default {
  name: 'infected',
  data() {
    return {
      data: [],
      total: 0,
      loading: true,
      //状态
      status:[{
        label: "未康复",
        value: "0",
        raw: {
          listClass: "danger",
          cssClass: ""
        }
      }, {
        label: "已康复",
        value: "1",
        raw: {
          listClass: "success",
          cssClass: ""
        }
      }],
    };
  },
  created() {
    this.getList();
  },

  methods: {
    getList() {
      this.loading = true;
      listInfected().then(res => {
        this.data = res.data;
        this.total = res.data.length;
        this.loading = false;
      })
    },
  }
}
</script>

<style scoped>
.main-contain{
  margin: 20px 30px;
  padding: 10px 20px;
}
</style>
