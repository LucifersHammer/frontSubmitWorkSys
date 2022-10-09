<template>
    <div>
        <el-row>
            <el-col :span="14">
                <!--查询条件及查询按钮-->
                <el-form :inline="true" :model="queryMap" class="demo-form-inline">
                    <el-form-item label="日期">
                        <el-date-picker
                                :picker-options="pickerOptions"
                                v-model="queryMap.date"
                                type="date"
                                value-format="yyyy-MM-dd"
                                placeholder="选择日期">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="项目">
                        <!--clearable 可清空-->
                        <!--filterable 可过滤查询-->
                        <el-select v-model="queryMap.pno" placeholder="项目" clearable filterable>
                            <el-option v-for="project in projectList" :label="project.pname" :value="project.pno"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="6">&nbsp;</el-col>
            <el-col :span="4">
                <el-button type="primary" icon="el-icon-search" @click="queryWithYear">报工汇总{{year}}</el-button>
            </el-col>
        </el-row>

        <el-table
                :data="selfRecordList"
                border
                :stripe="true"
                :header-cell-style="{background:'#4CA9EE',color:'white','text-align':'center'}"
                max-height="550px"
                style="height: 550px">
            <!--序号列-->
            <el-table-column
                    type="index"
                    label="序号"
                    align="center"
                    width="50"
                    :index="indexMethod">
            </el-table-column>
            <!--prop属性对应的员工对象的实体类属性-->
            <!--对应的是后台封装的map的key值-->
            <!--后台的map集合的key值由sql语句中的查询字段决定-->
            <el-table-column
                    prop="ename"
                    label="姓名"
                    align="center"
                    width="100">
            </el-table-column>
            <el-table-column
                    prop="date"
                    align="center"
                    width="120"
                    label="报工日期">
            </el-table-column>
            <el-table-column
                    prop="attendance"
                    align="center"
                    width="100"
                    label="出勤情况">
            </el-table-column>
            <el-table-column
                    prop="workload"
                    align="right"
                    width="80"
                    label="工作量">
            </el-table-column>
            <el-table-column
                    prop="overtime"
                    align="right"
                    width="80"
                    label="加班时间">
            </el-table-column>
            <el-table-column
                    prop="pname"
                    align="left"
                    width="180"
                    label="项目">
            </el-table-column>
            <el-table-column
                    prop="instruction"
                    align="left"
                    label="工作描述">
            </el-table-column>
            <el-table-column
                    prop="status"
                    align="center"
                    width="120"
                    label="审核状态">
            </el-table-column>
        </el-table>
        <!--分页组件-->
        <!--layout分页组件的布局，显示向前向后，数字页面，每页可选显示条数，总条数-->
        <!--total代表数字总条数-->
        <!--page-size代表每页显示条数，不设置默认是10-->
        <!--current-page当前页码，默认为1-->
        <!--current-change当页码发生变化触发-->
        <el-pagination
                background
                layout="prev, pager, next, sizes, total"
                :total="total"
                :page-size="queryMap.size"
                :current-page="queryMap.current"
                :page-sizes="[5,10,15,20]"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange">
        </el-pagination>
    </div>
</template>

<script>
    export default {
        name: "SelfRecords",
        data(){
            return{
                eno:'',
                year:'',
                queryMap:{
                    date:'',
                    year:'',
                    pno:'',
                    eno:'',
                    current:1,
                    size:10
                },
                projectList:[],
                selfRecordList:[],
                total:0,
                //只能选择今天及之前的日期
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6;  //如果没有后面的-8.64e6就是不可以选择今天的
                    }
                },
            }
        },
        methods:{
            getProjectList(){
                this.$axios.get('/getProject/' + this.eno).then(res => {
                    this.projectList = res.data
                }).catch(()=>{
                    this.$message.error("获取项目列表失败,服务器错误")
                })
            },
            getSelfRecord(){
                this.$axios.post('getSelfRecord',this.queryMap).then(res => {
                    this.selfRecordList = res.data.data
                    this.total = res.data.count
                }).catch(()=>{
                    this.$message.error("获取个人报工记录失败,服务器错误")
                })
            },
            /**
             * 条件查询
             */
            query() {
                //清空按年查询条件
                this.queryMap.year = ''
                this.queryMap.eno = this.eno
                this.queryMap.current = 1
                this.getSelfRecord()

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
                this.queryMap.current = val
                //重新请求后台
                this.getSelfRecord()
            },
            /*当每页显示条数发生变化时触发*/
            handleSizeChange(val) {
                this.queryMap.size = val
                this.queryMap.current = 1
                this.getSelfRecord()
            },
            getYear(){
                let nowDate = new Date()
                this.year = nowDate.getFullYear() - 1
            },
            queryWithYear(){
                this.queryMap.eno = this.eno
                this.queryMap.current = 1
                this.queryMap.year = this.year
                //防止用户选择的日期绑定到querymap
                this.queryMap.date = ''
                this.getSelfRecord()
            }
        },
        created() {
            this.eno = sessionStorage.getItem("eno")
            this.query()
            this.getProjectList()
            this.getYear()
        }
    }
</script>

<style scoped>

</style>