<template>
    <div>
        <el-row>
            <el-col :span="18">
                <!--查询条件及查询按钮-->
                <el-form :inline="true" :model="queryMap" class="demo-form-inline">
                    <el-form-item label="姓名">
                        <el-input v-model="queryMap.ename"
                                  clearable
                                  style="width: 150px;"
                                  placeholder="员工姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="报工日期">
                        <el-date-picker
                                :picker-options="pickerOptions"
                                v-model="queryMap.startDate"
                                type="date"
                                clearable
                                style="width: 150px;"
                                value-format="yyyy-MM-dd"
                                placeholder="选择开始日期">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="至">
                        <el-date-picker
                                :picker-options="pickerOptions"
                                v-model="queryMap.endDate"
                                type="date"
                                clearable
                                style="width: 150px;"
                                value-format="yyyy-MM-dd"
                                placeholder="选择截至日期">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
                        <el-button type="primary" icon="el-icon-delete" @click="emptyQuery">清空</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
        </el-row>

        <el-table
                :data="deptRecordList"
                border
                :stripe="true"
                max-height="530px"
                style="height: 530px"
                :header-cell-style="{background:'#4CA9EE',color:'white','text-align':'center'}">
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
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="dname"
                    label="部门"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="date"
                    align="center"
                    label="报工日期">
            </el-table-column>
            <el-table-column
                    prop="datetime"
                    align="center"
                    label="报工时间"
                    width="200">
            </el-table-column>
            <el-table-column
                    prop="attendance"
                    align="center"
                    label="出勤情况">
            </el-table-column>
            <el-table-column
                    prop="overtime"
                    align="right"
                    label="加班时间">
            </el-table-column>
            <el-table-column
                    prop="pname"
                    align="left"
                    label="项目"
                    width="250">
            </el-table-column>
            <el-table-column
                    prop="status"
                    align="center"
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
    import {formatDate} from '../../utils/dateFormat'

    export default {
        name: "DeptRecords",
        data() {
            return {
                eno: '',
                queryMap: {
                    startDate: '',
                    endDate: '',
                    eno: '',
                    ename: '',
                    current: 1,
                    size: 10
                },
                deptRecordList: [],
                total: 0,
                //只能选择今天及之前的日期
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now() - 8.64e6;  //如果没有后面的-8.64e6就是不可以选择今天的
                    }
                },
            }
        },
        methods: {
            //使用封装的方法格式化日期
            formatTime(val) {
                let data = new Date(val)
                return formatDate(data, 'yyyy-MM-dd hh:mm:ss');
            },
            getDeptRecord() {
                this.$axios.post('getDeptRecord', this.queryMap).then(res => {
                    this.deptRecordList = res.data.data
                    for (let i = 0; i < this.deptRecordList.length; i++) {
                        if (this.deptRecordList[i].datetime !== null)
                        this.deptRecordList[i].datetime = this.formatTime(this.deptRecordList[i].datetime)
                    }

                    this.total = res.data.count
                }).catch(() => {
                    this.$message.error("获取部门报工记录失败,服务器错误")
                })
            },
            /**
             * 条件查询
             */
            query() {
                this.queryMap.eno = this.eno
                this.queryMap.current = 1
                this.getDeptRecord()

            },
            //清空查询条件
            emptyQuery() {
                this.queryMap.startDate = ''
                this.queryMap.endDate = ''
                this.queryMap.ename = ''
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
                this.getDeptRecord()
            },
            /*当每页显示条数发生变化时触发*/
            handleSizeChange(val) {
                this.queryMap.size = val
                this.queryMap.current = 1
                this.getDeptRecord()
            },
        },

        created() {
            this.eno = sessionStorage.getItem("eno")
            this.query()
        }
    }
</script>

<style scoped>

</style>