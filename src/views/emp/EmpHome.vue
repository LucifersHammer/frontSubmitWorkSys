<template>
    <div>
        <el-row>
            <el-col :span="20" :offset="2" style="height: 300px">
                <table class="e_table">
                    <tr style="border-bottom: #eaedf1 solid">
                        <td>
                            <el-row>
                                <el-col :span="2">填&emsp;报</el-col>
                                <el-col :span="12" :offset="10" align="right">
                                    <el-button type="primary" @click="toSubmit">个人填报</el-button>
                                    <el-button type="primary" @click="toSelfOmission">漏报记录</el-button>
                                    <el-button type="primary" @click="toSelfRecord">个人报工</el-button>
                                    <el-button type="primary" @click="query">刷新记录</el-button>
                                </el-col>
                            </el-row>
                        </td>
                    </tr>
                    <tr>
                        <td height="200px">
                            <el-row>
                                <el-col :span="11">
                                    <el-table
                                            v-if="omissionList.length !== 0"
                                            :show-header="false"
                                            :row-style="{height: '0'}"
                                            :cell-style="{padding:'0px'}"
                                            :data="omissionList"
                                            style="width: 100%"
                                            max-height="180"
                                            align="center">
                                        <el-table-column
                                                prop="uid"
                                                v-if="false">
                                        </el-table-column>
                                        <el-table-column
                                                prop="date">
                                        </el-table-column>
                                        <el-table-column>
                                            <template slot-scope="scope">
                                                漏报
                                            </template>
                                        </el-table-column>
                                        <el-table-column>
                                            <template slot-scope="scope">
                                                <el-button @click="toSubmit" type="text" size="small">立即补报>></el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                                <el-col :span="1">&nbsp;</el-col>
                                <el-col :span="11">
                                    <el-table
                                            v-if="backRecordsList.length !== 0"
                                            :show-header="false"
                                            :row-style="{height: '0'}"
                                            :cell-style="{padding:'0px'}"
                                            :data="backRecordsList"
                                            style="width: 100%"
                                            max-height="180"
                                            align="center">
                                        <el-table-column
                                                prop="uid"
                                                v-if="false">
                                        </el-table-column>
                                        <el-table-column
                                                prop="date">
                                        </el-table-column>
                                        <el-table-column>
                                            <template slot-scope="scope">
                                                报工被退回
                                            </template>
                                        </el-table-column>
                                        <el-table-column>
                                            <template slot-scope="scope">
                                                <el-button @click="toSubmit" type="text" size="small">重新报工>></el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </el-col>
                            </el-row>

                        </td>
                    </tr>
                </table>
            </el-col>
        </el-row>

        <el-row v-if="position === '部门经理'">
            <el-col :span="20" :offset="2" style="height: 300px">
                <table class="e_table">
                    <tr style="border-bottom: #eaedf1 solid">
                        <td>
                            <el-row>
                                <el-col :span="2">阿米巴</el-col>
                                <el-col :span="10" :offset="12" align="right">
                                    <el-button type="primary" @click="toDeptOmission">漏报记录</el-button>
                                    <el-button type="primary" @click="toDeptRecords">部门报工</el-button>
                                    <el-button type="primary" @click="getNotAudit">刷新记录</el-button>
                                </el-col>
                            </el-row>
                        </td>
                    </tr>
                    <tr>
                        <td height="200px">
                            <el-row v-if="notAuditList.length !== 0">
                                <el-col :span="12" align="left">
                                    <ul style="list-style-type: none">
                                        <li v-for="(item,index) in notAuditList" :key="item.date">
                                            {{item.date}}&nbsp;未审:{{item.num}}人&emsp;
                                            <el-link type="primary"
                                                     @click="toDeptAudit"
                                                     v-if="index === 0"
                                                     style="font-size: 15px">
                                                立即审核>>
                                            </el-link>
                                        </li>
                                    </ul>
                                </el-col>
                            </el-row>
                        </td>
                    </tr>
                </table>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "EmpHome",
        data() {
            return {
                eno: '',
                position: '',
                queryMap: {
                    eno: '',
                    auditStatus: ''
                },
                omissionList: [],
                backRecordsList: [],
                notAuditList:[],
            }
        },
        methods: {
            //根据条件获取相应全部记录，不分页
            getRecords(auditStatus) {
                this.queryMap.eno = this.eno
                this.queryMap.auditStatus = auditStatus
                this.$axios.post('getRecordsByEno', this.queryMap).then(res => {
                    if (auditStatus === '漏报') {
                        this.omissionList = res.data
                    } else {
                        this.backRecordsList = res.data
                    }
                }).catch(() => {
                    this.$message.error("无法获取报工记录，服务器错误")
                })
            },
            query() {
                this.getRecords('漏报')
                this.getRecords('退回')
            },

            getNotAudit(){
                this.$axios.get('getNotAudit/' + this.eno).then(res => {
                    this.notAuditList = res.data
                }).catch(() => {
                    this.$message.error("无法获取未审核记录，服务器错误")
                })
            },

            //按钮跳转
            toSubmit(){
                this.$store.commit("addTab", {index:"/submitMission", title:"报工填报"});
                this.$router.push({
                    path:"/submitMission"
                })
            },
            toSelfOmission(){
                this.$store.commit("addTab", {index:"/selfOmission", title:"个人漏报记录"});
                this.$router.push({
                    path:"/selfOmission"
                })
            },
            toSelfRecord(){
                this.$store.commit("addTab", {index:"/selfRecords", title:"个人报工记录"});
                this.$router.push({
                    path:"/selfRecords"
                })
            },
            toDeptAudit(){
                this.$store.commit("addTab", {index:"/deptAudit", title:"部门审核"});
                this.$router.push({
                    path:"/deptAudit"
                })
            },
            toDeptOmission(){
                this.$store.commit("addTab", {index:"/deptOmission", title:"漏报汇总"});
                this.$router.push({
                    path:"/deptOmission"
                })
            },
            toDeptRecords(){
                this.$store.commit("addTab", {index:"/deptRecords", title:"部门报工汇总"});
                this.$router.push({
                    path:"/deptRecords"
                })
            },

        },
        created() {
            this.eno = sessionStorage.getItem("eno")
            this.position = sessionStorage.getItem("position")
            this.query()
            if (this.position === '部门经理') {
                this.getNotAudit()
            }
        }
    }
</script>

<style scoped>
    .e_table {
        width: 100%;
        margin-top: 10px;
        border: 1px solid #F5F6F7;
        border-collapse: collapse;
        box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)
    }
</style>