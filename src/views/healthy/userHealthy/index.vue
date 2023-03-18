<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--班级数据-->
      <el-col :span="4" :xs="24">
        <div class="head-container">
          <el-input
            v-model="collegeName"
            placeholder="请输入班级名称"
            clearable
            size="small"
            prefix-icon="el-icon-search"
            style="margin-bottom: 20px"
          />
        </div>
        <div class="head-container">
          <el-tree
            :data="collegeOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            node-key="id"
            default-expand-all
            highlight-current
            @node-click="handleNodeClick"
          />
        </div>
      </el-col>
      <!--用户数据-->
      <el-col :span="20" :xs="24">

        <el-tabs v-model="queryParams.tabActiveName" @tab-click="handleTabClick">
          <el-tab-pane label="全部" name="all"></el-tab-pane>
          <el-tab-pane label="今日未报备" name="noReport"></el-tab-pane>
          <el-tab-pane label="感染者" name="infected"></el-tab-pane>
          <el-tab-pane label="未全程接种疫苗" name="noVaccines"></el-tab-pane>
        </el-tabs>

        <el-table v-loading="loading" :data="userList">
          <el-table-column type="expand">
            <template slot-scope="props">
              <div v-if="props.row.infected !== null">
                <span class="content-title">最新感染信息</span>
                <el-form inline class="demo-table-expand" style="margin-top: 10px">
                  <el-form-item label="感染时间:">
                    <span>{{ parseTime(props.row.infected.createTime, '{y}-{m}-{d}') }}</span>
                  </el-form-item>
                  <el-form-item label="最高体温:">
                    <span>{{ props.row.infected.maxTemperature + '°C' }}</span>
                  </el-form-item>
                  <el-form-item label="康复时间:" v-if="props.row.infected.status == 1">
                    <span>{{ parseTime(props.row.infected.recoveryTime, '{y}-{m}-{d}') }}</span>
                  </el-form-item>
                  <el-form-item label="状态:">
                    <my-tag :options="status" :value="props.row.infected.status"/>
                  </el-form-item>
                </el-form>
              </div>
              <div v-else class="data-empty"><span>暂无感染记录</span></div>
              <el-divider />
              <div v-if="props.row.vaccines !== null && props.row.vaccines.length >= 1">
                <span class="content-title">疫苗信息</span>
                <el-form inline class="demo-table-expand" style="margin-top: 10px" v-for="item in props.row.vaccines" :key="item.vaccinesId">
                  <el-form-item label="接种单位:">
                    <span>{{ item.company }}</span>
                  </el-form-item>
                  <el-form-item label="接种时间:">
                    <span>{{ parseTime(item.time, '{y}-{m}-{d}') }}</span>
                  </el-form-item>
                  <el-form-item label="疫苗品牌:">
                    <span>{{ item.vaccinesBrand }}</span>
                  </el-form-item>
                  <el-form-item label="针次:">
                    <el-tag>{{ item.frequency }}</el-tag>
                  </el-form-item>
                </el-form>
              </div>
              <div v-else class="data-empty"><span>暂无注射疫苗信息</span></div>
            </template>
          </el-table-column>
          <el-table-column label="用户编号" align="center" key="userId" prop="user.userId" />
          <el-table-column label="用户名称" align="center" key="userName" prop="user.userName"  />
          <el-table-column label="用户昵称" align="center" key="nickName" prop="user.nickName" />
          <el-table-column label="性别" align="center" key="sex" prop="user.sex" >
            <template slot-scope="scope">{{ scope.row.sex == '0'?'男':'女'}}</template>
          </el-table-column>
          <el-table-column label="班级" align="center" key="collegeName" prop="user.college.collegeName" />
          <el-table-column label="手机号码" align="center" key="phone" prop="user.phone"/>
        </el-table>

        <pagination
          v-show="total>0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </el-col>
    </el-row>

  </div>
</template>

<script>
import { collegeTreeSelect } from "@/api/system/user";
import { listUserHealthy } from "@/api/healthy/userHealthy";
import Treeselect from "@riophae/vue-treeselect";
import "@riophae/vue-treeselect/dist/vue-treeselect.css";

export default {
  name: "userHealthy",
  components: { Treeselect },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 用户表格数据
      userList: null,
      // 部门树选项
      collegeOptions: undefined,
      // 学院班级名称
      collegeName: undefined,
      // 表单参数
      form: {},
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        collegeId: undefined,
        tabActiveName: "all",
      },
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
  watch: {
    // 根据名称筛选学院班级树
    collegeName(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getList();
    this.getCollegeTree();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      listUserHealthy(this.queryParams).then(response => {
          if (response.data === undefined) {
            this.userList = null;
            this.total = 0;
          } else {
            this.userList = response.data.records;
            this.total = response.data.total;
          }
          this.loading = false;
        }
      );
    },
    /** 查询学院班级下拉树结构 */
    getCollegeTree() {
      collegeTreeSelect().then(response => {
        this.collegeOptions = response.data;
      });
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.collegeId = data.id;
      this.handleQuery();
    },

    /** 班级搜索操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },

    /** 标签点击事件 */
    handleTabClick() {
      this.getList()
    },

  }
};
</script>

<style>
.demo-table-expand {
  font-size: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 25%;
}
.content-title {
  font-size: 16px;
  font-weight: bold;
  margin-left: 10px;
}
.data-empty {
  font-size: 16px;
  text-align: center;
}
</style>
