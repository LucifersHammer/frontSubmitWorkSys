<template>
    <div>
        <el-row>
            <el-col :span="19">
                <!--员工姓名和部门信息的查询条件及查询按钮-->
                <el-form :inline="true" :model="queryMap" class="demo-form-inline">
                    <el-form-item label="员工工号">
                        <el-input v-model="queryMap.eno" clearable style="width: 150px" placeholder="员工工号"></el-input>
                    </el-form-item>
                    <el-form-item label="员工姓名">
                        <el-input v-model="queryMap.ename" clearable style="width: 150px" placeholder="员工姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="日期">
                        <el-date-picker
                                style="width: 150px"
                                clearable
                                :picker-options="pickerOptions"
                                v-model="queryMap.date"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
                        <el-button type="primary" icon="el-icon-delete" @click="emptyQuery">清空</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <!--<el-col :span="2">
                &nbsp;
            </el-col>-->
            <el-col :span="5">
                <!--批量操作按钮-->
                <el-button-group>
                    <el-button type="primary"  @click="submitBatch">批量提交</el-button>
                    <el-button type="primary"  @click="backBatch">批量退回</el-button>
                </el-button-group>
            </el-col>
        </el-row>

        <el-table
                :data="notAuditList"
                border
                max-height="530px"
                style="height: 530px"
                :header-cell-style="{background:'#4CA9EE',color:'white','text-align':'center'}"
                @selection-change="selectChange">
            <!--序号列-->
            <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    width="50"
                    :index="indexMethod">
            </el-table-column>
            <!--多选框-->
            <el-table-column
                    type="selection"
                    label="全选"
                    align="center"
                    width="55">
            </el-table-column>
            <!--prop属性对应的员工对象的实体类属性-->
            <!--对应的是后台封装的map的key值-->
            <!--后台的map集合的key值由sql语句中的查询字段决定-->
            <el-table-column
                    type="uid"
                    v-if="false"
                    width="55">
            </el-table-column>
            <el-table-column
                    prop="eno"
                    label="工号"
                    align="center"
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="ename"
                    label="姓名"
                    align="center"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="dname"
                    align="center"
                    width="130"
                    label="所属部门">
            </el-table-column>
            <el-table-column
                    prop="date"
                    align="center"
                    label="报工日期">
            </el-table-column>
            <el-table-column
                    prop="attendance"
                    align="center"
                    label="出勤情况">
            </el-table-column>

            <el-table-column
                    prop="workload"
                    align="right"
                    width="100"
                    label="工作量">
            </el-table-column>
            <el-table-column
                    prop="overtime"
                    align="right"
                    width="100"
                    label="加班时间">
            </el-table-column>
            <el-table-column
                    prop="pname"
                    align="left"
                    width="180"
                    label="项目组">
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="100">
                <template slot-scope="scope">
                    <el-button @click="submit(scope.row)" type="text" size="small">提交</el-button>
                    <el-button @click="back(scope.row)" type="text" size="small">退回</el-button>
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
                background
                layout="prev, pager, next, sizes, total"
                :total="total"
                :page-size="queryMap.limit"
                :current-page="queryMap.page"
                :page-sizes="[5,10,15,20]"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: "DeptAudit",
        data(){
            return{
                mgrEno:'',
                /*绑定到了查询表单上*/
                queryMap:{
                    mgrEno:'',
                    eno:'',
                    ename:'',
                    date:'',
                    current: 1,
                    size: 10
                },
                total: 0,
                notAuditList:[],
                //数组对象，用于存储选中的记录数
                checkedData: [],
                //只能选择今天及之前的日期
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6;  //如果没有后面的-8.64e6就是不可以选择今天的
                    }
                },
                auditForm:{
                    uids:[],
                    status:''
                }
            }
        },
        methods:{
            getNotAuditRecord() {
                this.$axios.post('getNotAuditRecordByPage',this.queryMap).then(res => {
                    this.notAuditList = res.data.data
                    this.total = res.data.count
                }).catch(() => {
                    this.$message.error("无法获取未审核记录信息，服务器错误")
                })
            },
            /**
             * 条件查询
             */
            query() {
                this.queryMap.mgrEno = this.mgrEno
                this.queryMap.current = 1
                this.getNotAuditRecord()

            },
            //清空查询条件
            emptyQuery() {
                this.queryMap.eno = ''
                this.queryMap.ename = ''
                this.queryMap.date = ''
            },
            //序号
            indexMethod(index) {
                return index + 1;
            },
            /*
            * 当页码发生变化时触发这个时间
            */
            handleCurrentChange(val) {
                //val代表当前页码
                this.queryMap.page = val
                //重新请求后台
                this.getNotAuditRecord()
            },
            /*当每页显示条数发生变化时触发*/
            handleSizeChange(val) {
                this.queryMap.limit = val
                this.queryMap.page = 1
                this.getNotAuditRecord()
            },
            /**
             * 表格选中项发生变化时触发，可以通过该方法得到当前的选中记录
             */
            selectChange(val) {
                this.checkedData = val
            },

            //提交
            submit(record) {
                this.auditForm.uids.push(record.uid)
                this.auditForm.status = '已审核'
                this.updateStatus()
            },
            //批量提交
            submitBatch() {
                for (let i = 0; i < this.checkedData.length; i++) {
                    this.auditForm.uids.push(this.checkedData[i].uid)
                }
                this.auditForm.status = '已审核'
                this.updateStatus()
            },
            //退回
            back(record) {
                this.auditForm.uids.push(record.uid)
                this.auditForm.status = '退回'
                this.updateStatus()
            },
            backBatch() {
                for (let i = 0; i < this.checkedData.length; i++) {
                    this.auditForm.uids.push(this.checkedData[i].uid)
                }
                this.auditForm.status = '退回'
                this.updateStatus()
            },
            //传后台
            updateStatus() {
                if (this.auditForm.uids.length <= 0) {
                    this.$message.warning("请选择要提交或退回的记录！")
                    return false
                }
                this.$axios.post("audit",this.auditForm).then(res => {
                    if (res.data) {
                        this.getNotAuditRecord()
                        this.$message.success("修改成功")
                    } else {
                        this.$message.error("修改失败，服务器错误")
                    }
                }).catch(() => {
                    this.$message.error("修改失败，服务器错误")
                }).finally(() => {
                    this.auditForm = {
                        uids:[],
                        status:''
                    }
                })
            }
        },
        created() {
            this.mgrEno = sessionStorage.getItem("eno")
            //页面一进来就去获取全部的员工信息
            this.query()
        }

    }
</script>

<style scoped>

</style>