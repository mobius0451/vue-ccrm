<template>
  <div v-loading="loading">
    <el-row>

      <el-col :span="17">
        <el-row>
          <el-col :sm="12" :lg="6">
            <el-card class="box-card">
              <el-result v-if="report" icon="success" title="完成" subTitle="今日健康报备" />
              <el-result v-else icon="warning" title="未完成" subTitle="今日健康报备" />
            </el-card>
          </el-col>

          <el-col :sm="12" :lg="6">
            <el-card class="box-card">
              <el-result v-if="infected" icon="error" title="阳性患者" subTitle="您感染了新冠" />
              <el-result v-else icon="success" title="身体健康" subTitle="暂无感染新冠" />
            </el-card>
          </el-col>

          <el-col :sm="12" :lg="6">
            <el-card class="box-card">
              <el-result v-if="vaccines" icon="success" title="完成" subTitle="全程疫苗接种" />
              <el-result v-else icon="warning" title="未完成" subTitle="全程疫苗接种" />
            </el-card>
          </el-col>

          <el-col :sm="12" :lg="6">
            <el-card class="box-card">
              <el-result v-if="serious" icon="error" title="重症者" subTitle="满足重症标准" />
              <el-result v-else icon="info" title="非重症者" subTitle="不在重症范畴" />
            </el-card>
          </el-col>
        </el-row>

        <el-row>
          <el-col>
            <el-carousel :interval="4000" type="card" height="300px" style="margin: 20px 0 0 10px">
              <el-carousel-item v-for="item in indexPic" :key="item">
                <img v-if="item" :src="item" class="pic-carousel" alt="">
              </el-carousel-item>
            </el-carousel>
          </el-col>
        </el-row>

      </el-col>

      <el-col :span="7">
        <el-card class="box-card">
          <div slot="header" class="clearfix">
            <span style="font-size: 20px">公告通知栏</span>
            <el-dropdown @command="handleCommand" style="float: right;margin-right: 10px;">
              <span class="el-dropdown-link"><i class="el-icon-arrow-down el-icon--right"></i></span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item>全部</el-dropdown-item>
                <el-dropdown-item command="1">通知</el-dropdown-item>
                <el-dropdown-item command="2">公告</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <div  class="text item">
            <div v-for="item in lastNotice" :key="item.noticeId" @click="getNoticeDetail(item.noticeId)">
              <el-card shadow="hover" class="noticeList">
                <div style="display: flex;margin-bottom: -8px">
                  <el-tag type="warning" style="margin-right: 5px" v-if="item.noticeType === '1'">通知</el-tag>
                  <el-tag type="success" style="margin-right: 5px" v-else>公告</el-tag>
                  <span class="notice-title" :title="item.noticeTitle">{{ item.noticeTitle }}</span>
                </div>
                <span class="rightTxt">{{ parseTime(item.createTime, '{y}-{m}-{d}') }}</span>
              </el-card>
            </div>
          </div>
        </el-card>
      </el-col>

    </el-row>

    <el-drawer
      :visible.sync="drawer"
      :with-header="false">
      <div class="noticeTitle">{{noticeDetail.noticeTitle }}</div>
      <div style="display: flex">
        <my-tag :options="noticeType" :value="noticeDetail.noticeType" style="margin: 0 10px"/>
        <div class="noticeTime">{{ noticeDetail.createTime }}</div>
      </div>
      <div class="content">{{ noticeDetail.noticeContent }}</div>
      <div><img v-if="noticeDetail.picture" :src="noticeDetail.picture" class="pic" alt=""></div>
    </el-drawer>

  </div>


</template>

<script>
import {  todayReport } from '@/api/healthy/report'
import { checkInfected  } from '@/api/healthy/infected'
import { checkVaccines  } from '@/api/healthy/vaccines'
import { getNotice, lastNotice } from '@/api/system/notice'
import { getSeriousInfo } from '@/api/serious/info'

export default {
  name: "Index",
  data() {
    return {
      // 加载界面
      loading: false,
      // 内容抽屉
      drawer: false,
      // 版本号
      version: "1.0.0",

      report: true,
      infected: false,
      vaccines: false,
      serious: false,

      lastNotice: [],

      query: {
        noticeType: undefined,
      },

      indexPic: [],

      noticeDetail: {},

      //通知类型
      noticeType:[{
        label: "通知",
        value: "1",
        raw: {
          listClass: "warning",
          cssClass: ""
          }
        }, {
        label: "公告",
        value: "2",
        raw: {
          listClass: "success",
          cssClass: ""
        }
      }],

    };
  },

  created() {
    this.loading = true;
    this.checkTodayReport();
    this.checkInfected();
    this.checkVaccines();
    this.checkSerious();
    this.getNotice();
    this.getNoticePic();
    this.loading = false;
  },

  methods: {

    checkTodayReport() {
      todayReport().then(res => {
        if(res.data == 0) {
          this.report = false;
        }
      });
    },
    checkInfected() {
      checkInfected().then(res => {
        if (res.data !== undefined) {
          if (res.data.status == 0) {
            this.infected = true;
          }
        }
      });
    },
    checkVaccines() {
      checkVaccines().then(res => {
        if (res.data !== undefined) {
          if(res.data.length >= 3) {
            this.vaccines = true;
          }
        }
      });
    },
    checkSerious() {
      getSeriousInfo().then(res => {
        if (res.data !== undefined) {
          let seriousInfo = res.data
          if (seriousInfo.withDisease !== 0 || seriousInfo.vaccines !== 1 || seriousInfo.discomfort !== 0) {
            this.serious = true;
          }
        }
      })
    },

    getNotice(query) {
      lastNotice(query).then(res => {
        this.lastNotice = res.data;
      });
    },
    getNoticePic() {
      lastNotice().then(res => {
        res.data.forEach(item => {
          if (item.picture !== null && item.picture !== '') {
            this.indexPic.push(process.env.VUE_APP_BASE_API + item.picture)
          }
        });
      });
    },

    getNoticeDetail(param) {
      getNotice(param).then(res => {
        if (res.data.picture !== null || res.data.picture !== '') {
          res.data.picture =  process.env.VUE_APP_BASE_API + res.data.picture;
        }
        this.noticeDetail = res.data;
      })
      this.drawer = true;
    },

    handleCommand(command) {
      this.query.noticeType = command
      this.getNotice(this.query);
    },

  },
};
</script>

<style>

.box-card {
  margin: 10px;
}

.noticeList {
  width: 100%;
  margin-bottom: 5px;
}

.rightTxt {
  float: right;
  margin-top: -16px;
}

.notice-title {
  max-width: 100px;
  display:block;
  word-break:keep-all;
  white-space:nowrap;
  overflow:hidden;
  text-overflow:ellipsis;
  -o-text-overflow:ellipsis;
  -icab-text-overflow:ellipsis;
  -khtml-text-overflow:ellipsis;
  -moz-text-overflow: ellipsis;
  -webkit-text-overflow:ellipsis;
}

.noticeTitle {
  margin: 20px 10px;
  font-size: 20px;
  font-weight: bold;
}
.noticeTime {
  font-size: 14px;
  margin: 5px;
  font-weight: lighter;
}
.content {
  margin: 20px 10px;
}
.pic {
  margin: 10px;
  width: auto;
  height: 250px;
}

/*走马灯样式*/
.pic-carousel {
  height: 300px;
  width: auto;
}
.el-carousel__item img {
  color: #475669;
  font-size: 14px;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
}
.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}
.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}
</style>

