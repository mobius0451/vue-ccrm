<template>

  <div>
    <el-row>
      <el-col :span="24">
        <el-card class="picture-card">
          <div id="difference-symptom" class="picture"></div>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <el-card class="picture-card">
          <div id="count-type" class="picture"></div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import * as echarts from 'echarts';
import { eachSeriousBar, eachSeriousPie } from '@/api/statistics/statistics'

export default {
  name: 'index',

  data() {
    return {
      yi:'柱形不同症状的人员数量',
      er: '不同症状数量人数饼图',
    }
  },

  created() {
    this.eachSeriousBar();
    this.eachSeriousPie();
  },

  mounted() {
    // this.myPie()
    // this.myBar()
  },

  methods: {

    eachSeriousBar() {
      eachSeriousBar().then(response => {
        let barData = []
        barData.push(response.data.age)
        barData.push(response.data.vaccines)
        barData.push(response.data.withDisease)
        barData.push(response.data.discomfort)
        this.myBar(barData)
      });
    },

    eachSeriousPie() {
      eachSeriousPie().then(response => {
        let pieData = []

        let obj1 = {}
        obj1.value = response.data.infected
        obj1.name = '重症感染者'
        pieData.push(obj1)

        let obj2 = {}
        obj2.value = response.data.noInfected
        obj2.name = '重症监护者'
        pieData.push(obj2)

        let obj3 = {}
        obj3.value = response.data.notSerious
        obj3.name = '非重症人员'
        pieData.push(obj3)
        this.myPie(pieData)
      });
    },

    myBar(barData) {
      // 基于准备好的dom，初始化echarts实例
      let myChart = echarts.init(document.getElementById('difference-symptom'));

      // 绘制图表
      let option = {
        title: {
          text: '各症状项人数',
          textStyle: {
            fontSize: 15
          }
        },
        tooltip: {},
        xAxis: {
          data: ['年龄大于65岁', '未成全程疫苗接种', '合并较为严重慢性疾病', '有不良症状']
        },
        yAxis: {},
        series: [
          {
            name: '销量',
            type: 'bar',
            data: barData
          }
        ]
      };

      myChart.setOption(option);
    },

    myPie(pieData) {
      let myChart = echarts.init(document.getElementById("count-type"));

      let option = {
        title: {
          text: '各重症分类人员比例',
          left: 'center',
          style: {
            fontSize: 15
          }
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
            name: '人数',
            type: 'pie',
            radius: '50%',
            data: pieData,
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ],
        color: ['#d05800', '#0086b7', '#56a400', '#510083']
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
