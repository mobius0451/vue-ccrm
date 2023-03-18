<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" v-show="showSearch" label-width="68px">
      <el-form-item label="出校类型" prop="outType">
        <el-select v-model="queryParams.outType" placeholder="选择出校类型" clearable>
          <el-option
            v-for="type in outType"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="审核状态" prop="status" v-hasPermi="['access:out:check']">
        <el-select v-model="queryParams.status" placeholder="选择审核类型" clearable>
          <el-option
            v-for="type in statusContent"
            :key="type.value"
            :label="type.label"
            :value="type.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="创建时间">
        <el-date-picker
          v-model="dateRange"
          style="width: 240px"
          value-format="yyyy-MM-dd"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleOutAdd"
          v-hasPermi="['access:out:check']"
        >申请出校</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="primary"
          plain
          icon="el-icon-plus"
          size="mini"
          @click="handleNoCheckOutAdd"
          v-hasPermi="['access:out:noCheck']"
        >无审出校</el-button>
      </el-col>
      <el-col :span="1.5">
        <el-button
          type="danger"
          plain
          icon="el-icon-delete"
          size="mini"
          :disabled="multiple"
          @click="handleDelete"
          v-hasPermi="['access:out:remove']"
        >删除</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table v-loading="loading" :data="outList" @selection-change="handleSelectionChange" >
      <el-table-column type="selection" width="55" align="center" />
      <el-table-column type="expand"  v-hasPermi="['access:out:noCheck']">
        <template slot-scope="props">
          <div>
            <span class="content-title">其他信息</span>
            <el-form inline class="demo-table-expand" style="margin-top: 10px">
              <el-form-item label="开始时间:">
                <span>{{ props.row.beginTime }}</span>
              </el-form-item>
              <el-form-item label="结束时间:">
                <span>{{ props.row.overTime }}</span>
              </el-form-item>
              <el-form-item label="出校去向:">
                <span>{{ props.row.outWhere }}</span>
              </el-form-item>
              <el-form-item label="出校原因:">
                <span>{{ props.row.outReason }}</span>
              </el-form-item>
            </el-form>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="序号" align="center" prop="outId" width="100" />
      <el-table-column label="申请人" align="center" prop="createBy" width="100" />
      <el-table-column label="联系方式" align="center" prop="contact" width="200" />
      <el-table-column label="出校类型" align="center" prop="outType" width="200">
        <template slot-scope="scope">
          <my-tag :options="outType" :value="scope.row.outType"/>
        </template>
      </el-table-column>
      <el-table-column label="审核状态" align="center" prop="status" width="200" >
        <template slot-scope="scope">
          <my-tag :options="statusContent" :value="scope.row.status"/>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" prop="createTime" width="200">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.createTime, '{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-document-checked"
            @click="handleOutCheck(scope.row)"
            v-hasPermi="['access:out:check']"
          >审核</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-tickets"
            @click="handleOutDetail(scope.row)"
            v-hasPermi="['access:out:check']"
          >详情</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-hasPermi="['access:out:remove']"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />



    <el-dialog title="无审出校" :visible.sync="open">
      <el-form  ref="form" :model="form" :rules="rules">
        <el-row>
          <el-col :span="12">
            <el-form-item label="出校类型" prop="outType">
              <el-select v-model="form.outType" placeholder="请选择出校类型">
                <el-option
                  v-for="type in outType"
                  :key="type.value"
                  :label="type.label"
                  :value="type.value"
                ></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="出校去向" prop="outWhere">
              <el-cascader
                ref="ownArea"
                @change="selectArea"
                :props="{value:'label', label: 'label', children: 'children'}"
                :options="areaCity" v-model="form.outWhere"
                props.expandTrigger="hover"
                clearable placeholder="请选择地区位置">
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="开始时间" prop="beginTime">
              <el-date-picker
                v-model="form.beginTime"
                type="date"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="结束时间" prop="overTime">
              <el-date-picker
                v-model="form.overTime"
                type="date"
                placeholder="选择日期时间">
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="出校原因" prop="outReason">
          <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="form.outReason">
          </el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="contact">
          <el-input v-model="form.contact" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="submitForm">确定</el-button>
        <el-button type="danger" size="mini" @click="open = false">关闭</el-button>
      </div>
    </el-dialog>

  </div>

</template>

<script>
import { listOut, delOut, addOut } from '@/api/access/out'
import areaDict from "@/plugins/area"

export default {
  name: "Out",
  data() {
    return {
      areaCity: areaDict,
      // 遮罩层
      loading: true,
      // 无审出校弹窗
      open: false,
      //无审出校表单
      form: {},
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      // 出校信息表格数据
      outList: [],
      // 日期范围
      dateRange: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        outType: undefined,
        status: undefined
      },
      //状态内容
      statusContent:[{
        label: "审核中",
        value: "0",
        raw: {
          listClass: "primary",
          cssClass: ""
        }
      }, {
        label: "审核通过",
        value: "1",
        raw: {
          listClass: "success",
          cssClass: ""
        }
      },{
        label: "拒绝申请",
        value: "2",
        raw: {
          listClass: "danger",
          cssClass: ""
        }
      }],
      //出校类型
      outType:[{
        label: "临时出校",
        value: "0",
        raw: {
          listClass: "warning",
          cssClass: ""
        }
      }, {
        label: "固定出校",
        value: "1",
        raw: {
          listClass: "primary",
          cssClass: ""
        }
      }],
      // 表单校验
      rules: {
        outType: [
          { required: true, message: "出校类型不能为空", trigger: "blur" }
        ],
        outWhere: [
          { required: true, message: "出校去向不能为空", trigger: "blur" }
        ],
        beginTime: [
          { required: true, message: "开始时间不能为空", trigger: "blur" }
        ],
        overTime: [
          { required: true, message: "结束时间不能为空", trigger: "blur" }
        ],
        contact: [
          { required: true, message: "联系方式不能为空", trigger: "blur" }
        ],
      },

    };
  },

  created() {
    this.getList();
  },
  methods: {
    /** 查询出校申请列表 */
    getList() {
      this.loading = true;
      listOut(this.queryParams, this.dateRange).then(response => {
        this.outList = response.data.records;
        this.total = response.data.total;
        this.loading = false;
      });
    },
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (Array.isArray(this.form.outWhere)){
            this.form.outWhere = this.form.outWhere.join("/")
          }
          this.form.status = '1';
          addOut(this.form).then(response => {
            this.$modal.msgSuccess("申请成功");
            this.open = false;
          });
        }
      });
      this.open = false;
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.outId)
      this.single = selection.length!=1
      this.multiple = !selection.length
    },
    /** 无审出校操作 */
    handleNoCheckOutAdd() {
      this.reset();
      this.open = true;
    },
    /** 申请出校操作 */
    handleOutAdd: function() {
      this.$router.push("/access/detail/out/" + 0);
    },
    /** 审批申请操作 */
    handleOutCheck: function(row) {
      const outId = row.outId;
      this.$router.push("/access/check/out/" + outId);
    },
    /** 申请详情操作 */
    handleOutDetail: function(row) {
      const outId = row.outId;
      this.$router.push("/access/detail/out/" + outId);
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      const outIds = row.outId || this.ids
      this.$modal.confirm('是否确认删除公告编号为"' + outIds + '"的数据项？').then(function() {
        return delOut(outIds);
      }).then(() => {
        this.getList();
        this.$modal.msgSuccess("删除成功");
      }).catch(() => {});
    },
    //地区选择
    selectArea () {
      this.$refs.ownArea.dropDownVisible = false
    },
    // 表单重置
    reset() {
      this.form = {
        outId: undefined,
        outType: undefined,
        outReason: undefined,
        outWhere: undefined,
        beginTime: undefined,
        overTime: undefined,
        contact: undefined,
      };
      this.resetForm("form");
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
</style>
