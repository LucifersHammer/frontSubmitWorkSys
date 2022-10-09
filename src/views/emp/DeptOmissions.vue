<template>
    <div>
        <el-row>
            <el-col :span="8">
                <!--员工姓名和部门信息的查询条件及查询按钮-->
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

                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <el-table
                :data="omissionList"
                border
                :stripe="true"
                :header-cell-style="{background:'#4CA9EE',color:'white','text-align':'center'}"
                max-height="530px"
                style="height: 530px">
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
                    prop="eno"
                    label="工号"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="ename"
                    label="姓名"
                    align="center"
                    width="180">
            </el-table-column>
            <el-table-column
                    prop="dname"
                    align="center"
                    label="所属部门">
            </el-table-column>
            <el-table-column
                    prop="date"
                    align="center"
                    label="漏报日期">
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
        name: "DeptOmissions",
        data(){
            return{
                eno:'',
                queryMap:{
                    eno :'',
                    date:'',
                    current:1,
                    size:10,
                },
                omissionList:[],
                //总条数
                total: 0,
                //只能选择今天及之前的日期
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6;  //如果没有后面的-8.64e6就是不可以选择今天的
                    }
                },
            }
        },
        methods:{
            getDeptOmissionList(){
                this.$axios.post('getDeptOmission',this.queryMap).then(res => {
                    this.omissionList = res.data.data
                    this.total = res.data.count
                }).catch(() => {
                    this.$message.error("无法获取漏报信息，服务器错误")
                })
            },
            /**
             * 条件查询
             */
            query() {
                this.queryMap.eno = this.eno
                this.queryMap.current = 1
                this.getDeptOmissionList()

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
                this.getDeptOmissionList()
            },
            /*当每页显示条数发生变化时触发*/
            handleSizeChange(val) {
                this.queryMap.size = val
                this.queryMap.current = 1
                this.getDeptOmissionList()
            },
        },
        created() {
            this.eno = sessionStorage.getItem("eno")
            this.query();
        }
    }
</script>

<style scoped>
</style>