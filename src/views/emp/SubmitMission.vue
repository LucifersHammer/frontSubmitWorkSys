<template>
    <div align="center">
        <div class="work_form">
            <el-row>
                <el-col :span="3" style="height: 40px">
                    <span style="background-color: #3DACEB">&nbsp;</span>
                    <span style="font-size: 20px"> 报工录入</span>
                </el-col>
                <el-col :span="19">&nbsp;</el-col>
                <el-col :span="2">
                    <el-button type="primary" @click="submitForm('workForm')">提交</el-button>
                </el-col>
            </el-row>
            <hr style="background-color: #E7E7E7;width: 100%"/>

            <el-form :model="workForm" :rules="rules" ref="workForm" label-width="100px" class="demo-ruleForm">
                <el-form-item v-if="false">
                    <el-input v-model="workForm.uid" disabled></el-input>
                </el-form-item>
                <el-form-item label="员工姓名">
                    <el-input v-model="ename" disabled></el-input>
                </el-form-item>
                <el-form-item label="报工日期" required>
                    <el-form-item prop="date">
                        <el-date-picker type="date"
                                        change=""
                                        :picker-options="pickerOptions"
                                        placeholder="选择日期"
                                        v-model="workForm.date"
                                        value-format="yyyy-MM-dd"
                                        style="width: 100%;">
                        </el-date-picker>
                    </el-form-item>
                </el-form-item>
                <el-form-item label="出勤情况" prop="attendance">
                    <el-radio-group v-model="workForm.attendance" size="medium">
                        <el-row>
                            <el-radio label="上班">上班&emsp;&emsp;</el-radio>
                            <el-radio label="调休">调休&emsp;&emsp;</el-radio>
                            <el-radio label="请假">请假&emsp;&emsp;</el-radio>
                        </el-row>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="加班时间" prop="overtime">
                    <el-input v-model="workForm.overtime" type="number"></el-input>
                </el-form-item>
                <el-form-item label="项目" prop="pno">
                    <el-select v-model="workForm.pno" placeholder="请选择项目" filterable style="width: 100%">
                        <el-option v-for="project in projectList" :label="project.pname" :value="project.pno"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="工作说明">
                    <el-input type="textarea" size="medium" v-model="workForm.instruction"></el-input>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
    export default {
        name: "SubMitMission",
        data(){
            const checkOvertime = (rule, value, callback) => {
                if (value < 0) {
                    return callback(new Error('加班时间不能小于0!'))
                } else if (value > 12) {
                    return callback(new Error('加班时间不能大于12小时!'))
                }
                return callback()
            }

            const checkDate = async (rule, value, callback) => {
                let queryMap = {eno: this.eno, date: value}
                await this.$axios.post('checkAlreadySubmit', queryMap).then(res => {
                    if (res.data === -1) {
                        return callback(new Error('只能选择未报工的日期！'))
                    } else {
                        this.workForm.uid = res.data
                        return callback()
                    }
                })
            }

            return{
                eno:'',
                ename:'',
                workForm:{
                    uid:'',
                    eno:'',
                    date:'',
                    attendance:'上班',
                    workload:0,
                    overtime:0.0,
                    pno:'',
                    instruction:'',
                    status:''
                },
                projectList:[],
                rules: {
                    date: [
                        { type: 'string', required: true, message: '请选择报工日期', trigger: 'change' },
                        { validator: checkDate, trigger: 'change' }
                    ],
                    overtime: [
                        { validator: checkOvertime, trigger: 'change' }
                    ],
                    pno: [
                        {required: true, message: '请选择项目', trigger: 'change'},
                    ],
                },
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
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        if (this.workForm.attendance !== "请假") {
                            this.workForm.workload = 1
                        }
                        this.workForm.eno = this.eno
                        this.workForm.status = "未审核"
                        this.$axios.post("addOrUpdateWorkRecord", this.workForm).then(res => {
                            if (res.data === true) {
                                this.$message.success("报工录入成功！")
                                this.workForm = {
                                    uid: '',
                                    eno: '',
                                    date: '',
                                    attendance: '上班',
                                    workload: 0,
                                    overtime: 0.0,
                                    pno: '',
                                    instruction: '',
                                    status: ''
                                }
                                this.$refs['workForm'].resetFields()
                            } else {
                                this.$message.error("报工录入失败，服务器错误")
                            }
                        }).catch(() => {
                            this.$message.error("报工录入失败，服务器错误")
                        })
                    } else {
                        return false;
                    }
                });
            },
        },
        created() {
            this.eno = sessionStorage.getItem("eno")
            this.ename = sessionStorage.getItem("ename")
            this.getProjectList()
        },
    }
</script>

<style scoped>
    .work_form{
        width: 80%;
        height: 600px;
    }
    .demo-ruleForm{
        width: 500px;
    }
    .el-radio-button--medium .el-radio-button__inner {
        padding: 10px 20px;
        font-size: 14px;
        width: 80px;
    }
</style>