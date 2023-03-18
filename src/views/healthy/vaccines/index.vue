<template>

  <div v-loading="loading">
    <el-card class="main-contain" v-for="(item, index) in data" :key="index" v-if="total > 0">
      <el-descriptions title="疫苗信息">
        <el-descriptions-item label="用户名">{{ item.userName }}</el-descriptions-item>
        <el-descriptions-item label="接种单位">{{ item.company }}</el-descriptions-item>
        <el-descriptions-item label="疫苗厂家品牌">{{ item.vaccinesBrand }}</el-descriptions-item>
        <el-descriptions-item label="接种地点">{{ item.location }}</el-descriptions-item>
        <el-descriptions-item label="接种时间">{{ parseTime(item.time, '{y}-{m}-{d}') }}</el-descriptions-item>
        <el-descriptions-item label="针次">
          <el-tag size="small">{{ item.frequency }}</el-tag>
        </el-descriptions-item>
      </el-descriptions>
    </el-card>

    <el-empty :image-size="200" v-if="total == 0"></el-empty>
  </div>

</template>

<script>
import { listVaccines } from '@/api/healthy/vaccines'

export default {
  name: 'vaccines',
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
      listVaccines().then(res => {
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
