<template>

  <div>
    <el-row>
      <el-col :span="12">
        <el-card class="picture-card">
          <div id="no-report" class="picture"></div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="picture-card">
          <div id="vaccines-info" class="picture"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card class="picture-card">
          <div id="infected-&-recovery" class="picture"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { infectedNumLine, reportInfoBar, vaccinesNumPie } from '@/api/statistics/statistics'
import { parseTime } from '@/utils/common'

export default {
  name: 'index',

  data() {
    return {
      yi:'今日报备与未报备的柱形',
      er: '饼图疫苗信息',
      san: '双折线感染人数与恢复人数',
    }
  },

  created() {
    this.reportInfoBar();
    this.vaccinesNumPie();
    this.infectedNumLine()
  },

  mounted() {
  },

  methods: {

    reportInfoBar() {
      reportInfoBar().then(response => {
        let barDta = []
        barDta.push(response.data.todayReport)
        barDta.push(response.data.total - response.data.todayReport)
        this.myBar(barDta)
      })
    },

    vaccinesNumPie() {
      vaccinesNumPie().then(response => {
        let pieData = []
        response.data.forEach(item => {
          let obj = {}
          obj.value = item.numPerson
          obj.name = "注射疫苗" + item.numVaccines + "次"
          pieData.push(obj);
        });
        this.myPie(pieData);
      })
    },

    infectedNumLine() {
      let label = [], value = []
      infectedNumLine().then(response => {
        response.data.forEach(item => {
          label.push(item.infected_time)
          value.push(item.num)
        });
        this.myLine(label, value)
      });
    },

    myBar(barData) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('no-report'));

      // 绘制图表
      let option = {
        title: {
          text: '今日报备情况',
          textStyle: {
            fontSize: 15
          }
        },
        tooltip: {},
        xAxis: {
          data: ['已报备', '未报备']
        },
        yAxis: {},
        series: [
          {
            name: '人数',
            type: 'bar',
            data: barData
          }
        ],
        color: ['#23ade0']
      };

      myChart.setOption(option);
    },

    myLine(label, value) {
      let myChart = echarts.init(document.getElementById("infected-&-recovery"));

      let option = {
        title: {
          text: '感染人数变化',
          textStyle: {
            fontSize: 15
          }
        },
        xAxis: {
          type: 'category',
          data: label
        },
        yAxis: {
          type: 'value'
        },
        tooltip: {
          trigger: 'axis'
        },
        series: [
          {
            data: value,
            type: 'line',
            smooth: true
          }
        ]
      };

      myChart.setOption(option);
    },

    myPie(pieDate) {
      let myChart = echarts.init(document.getElementById("vaccines-info"));

      let option = {
        title: {
          text: '注射疫苗次数各人数比例',
          left: 'center',
          fontSize: 15
        },
        tooltip: {
          trigger: 'item'
        },
        legend: {
          orient: 'vertical',
          left: 'left'
        },
        series: [
          {
            name: '针次:人数',
            type: 'pie',
            radius: ['40%', '70%'],
            avoidLabelOverlap: false,
            itemStyle: {
              borderRadius: 10,
              borderColor: '#fff',
              borderWidth: 2
            },
            label: {
              show: false,
              position: 'center'
            },
            labelLine: {
              show: false
            },
            data: pieDate
          }
        ]
      };

      myChart.setOption(option);
    },

  }
}
</script>

<style scoped>
.picture-card {
  margin: 10px;
  height: 310px;
}
.picture {
  height: 310px;
  width: 100%;
}
</style>
