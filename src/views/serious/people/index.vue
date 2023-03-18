<template>
  <div class="app-container">

    <el-tabs v-model="queryParams.tabActiveName" @tab-click="handleTabClick">
      <el-tab-pane label="已登记人员" name="all"></el-tab-pane>
      <el-tab-pane label="重症感染者" name="infected"></el-tab-pane>
      <el-tab-pane label="重症监护者" name="noInfected"></el-tab-pane>
      <el-tab-pane label="非重症人员" name="notSerious"></el-tab-pane>
    </el-tabs>

    <el-table v-loading="loading" :data="peopleList">
      <el-table-column label="序号" align="center" type="index"/>
      <el-table-column label="登记人" align="center" prop="createBy" />
      <el-table-column label="年龄是否>65" align="center" prop="age">
        <template slot-scope="scope">
          <my-tag :options="resultIs" :value="scope.row.age"/>
        </template>
      </el-table-column>
      <el-table-column label="是否完成全程疫苗接种" align="center" prop="vaccines">
        <template slot-scope="scope">
          <my-tag :options="resultNot" :value="scope.row.vaccines"/>
        </template>
      </el-table-column>
      <el-table-column label="是否合并较为严重慢性疾病" align="center" prop="withDisease">
        <template slot-scope="scope">
          <my-tag :options="resultIs" :value="scope.row.withDisease"/>
        </template>
      </el-table-column>
      <el-table-column label="是否有呼吸频率增快、持续性高热、浑身肌肉疼痛等症状" align="center" prop="discomfort">
        <template slot-scope="scope">
          <my-tag :options="resultIs" :value="scope.row.discomfort"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d}') }}</span>
        </template>
      </el-table-column>
<!--      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">-->
<!--        <template slot-scope="scope">-->
<!--          <el-button-->
<!--            size="mini"-->
<!--            type="text"-->
<!--            icon="el-icon-document-checked"-->
<!--            @click="getUserDetail(scope.row)"-->
<!--            v-hasPermi="['access:out:examine']"-->
<!--          >用户详细</el-button>-->
<!--        </template>-->
<!--      </el-table-column>-->
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList(queryParams.tabActiveName)"
    />

  </div>
</template>

<script>
import { listPeople } from '@/api/serious/people'

export default {
  name: 'people',
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 重症人员表格数据
      peopleList: [],

      queryParams: {
        pageNum: 1,
        pageSize: 10,
        // tap激活名
        tabActiveName: "all",
      },

      //结果内容(反)
      resultIs:[{
        label: "否",
        value: "0",
        raw: {
          listClass: "success",
          cssClass: ""
        }
      }, {
        label: "是",
        value: "1",
        raw: {
          listClass: "danger",
          cssClass: ""
        }
      }],
      //结果内容
      resultNot:[{
        label: "否",
        value: "0",
        raw: {
          listClass: "danger",
          cssClass: ""
        }
      }, {
        label: "是",
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
    /** 查询出校申请列表 */
    getList() {
      this.loading = true;
      listPeople(this.queryParams).then(response => {
        this.peopleList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },

    /** 标签点击事件 */
    handleTabClick() {
      this.getList()
    },

    getUserDetail() {

    }

  }
}
</script>

<style scoped>
</style>
