<template>
    <div>
        <el-row>
            <el-col :span="15">
                <!--员工姓名和部门信息的查询条件及查询按钮-->
                <el-form :inline="true" :model="queryMap" class="demo-form-inline">
                    <el-form-item label="员工姓名">
                        <el-input v-model="queryMap.ename" placeholder="员工姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="所属部门">
                        <!--clearable 可清空-->
                        <!--filterable 可过滤查询-->
                        <el-select v-model="queryMap.dno" placeholder="所属部门" clearable filterable>
                            <el-option v-for="dept in deptList" :label="dept.dname" :value="dept.dno"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" icon="el-icon-search" @click="query">查询</el-button>
                    </el-form-item>
                </el-form>
            </el-col>
            <el-col :span="3">
                &nbsp;
            </el-col>
            <el-col :span="6">
                <!--增删改按钮-->
                <el-button-group>
                    <el-button type="primary" icon="el-icon-plus" @click="openAddDialog">新增</el-button>
                    <el-button type="primary" icon="el-icon-edit" @click="openEditDialog">编辑</el-button>
                    <el-button type="primary" icon="el-icon-delete" @click="delEmp">删除</el-button>
                </el-button-group>
            </el-col>
        </el-row>


        <!--员工信息的列表-->
        <!--data  代表表格要显示的数据-->
        <el-table
                :data="empList"
                border
                style="width: 100%;height: 600px"
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
                    prop="sex"
                    align="center"
                    label="性别">
            </el-table-column>
            <el-table-column
                    prop="phoneNumber"
                    align="center"
                    label="联系方式">
            </el-table-column>
            <el-table-column
                    prop="dname"
                    align="center"
                    label="所属部门">
            </el-table-column>
            <el-table-column
                    prop="position"
                    align="center"
                    label="职位">
            </el-table-column>
            <el-table-column
                    prop="pwd"
                    align="center"
                    label="密码">
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
                :page-size="queryMap.limit"
                :current-page="queryMap.page"
                :page-sizes="[5,10,15,20]"
                @current-change="handleCurrentChange"
                @size-change="handleSizeChange">
        </el-pagination>


        <!--新增或编辑的弹出框-->
        <el-dialog :title="formTitle" :visible.sync="dialogFormVisible">
            <el-form :model="empForm" :rules="rules" ref="empForm">
                <el-form-item label="姓名" :label-width="formLabelWidth" align="left" prop="ename">
                    <el-input v-model="empForm.ename" autocomplete="off" style="width: 300px;"></el-input>
                </el-form-item>
                <el-form-item label="性别" :label-width="formLabelWidth" align="left">
                    <!--lable对应的是单选钮的value属性值-->
                    <el-radio v-model="empForm.sex" label="男">男</el-radio>
                    <el-radio v-model="empForm.sex" label="女">女</el-radio>
                </el-form-item>
                <el-form-item label="联系方式" :label-width="formLabelWidth" align="left" prop="phoneNumber">
                    <el-input v-model="empForm.phoneNumber" autocomplete="off" style="width: 300px;"></el-input>
                </el-form-item>

                <el-form-item label="所属部门" :label-width="formLabelWidth" align="left" prop="dno">
                    <el-select v-model="empForm.dno" filterable placeholder="请选择所属部门" style="width: 300px;">
                        <el-option v-for="dept in deptList" :label="dept.dname" :value="dept.dno"
                                   :key="dept.dno"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="职位" :label-width="formLabelWidth" align="left" prop="position">
                    <el-select v-model="empForm.position" placeholder="请选择职位" style="width: 300px;">
                        <el-option value="普通员工">普通员工</el-option>
                        <el-option value="部门经理">部门经理</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="密码" :label-width="formLabelWidth" align="left" prop="pwd">
                    <el-input v-model="empForm.pwd" autocomplete="off" style="width: 300px;"></el-input>
                </el-form-item>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveOrUpdateEmp">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "EmpList",
        data(){
            // 验证手机号的规则
            const checkMobile = (rule, value, callback) => {
                const regMobile = /^1(?:3\d|4[4-9]|5[0-35-9]|6[67]|7[013-8]|8\d|9\d)\d{8}$/
                if (regMobile.test(value)) {
                    // 合法的输入
                    return callback()
                }
                callback(new Error('请输入合法的手机号!'))
            }

            return {
                /*绑定到了查询表单上*/
                queryMap:{
                    ename:'',
                    dno:'',
                    limit:10,
                    page:1
                },
                //要传给后台的表单(弹出框)
                empForm: {
                    eno: '',
                    ename: '',
                    sex: '男',
                    phoneNumber: '',
                    dno: '',
                    pwd:'',
                    position:""
                },
                //所有的部门信息
                deptList:[],
                //员工列表信息
                empList:[],
                //数组对象，用于存储选中的记录数
                checkedData: [],
                //总条数
                total: 0,
                //增/改标题
                formTitle: '',
                //弹出框显示或隐藏
                dialogFormVisible: false,
                //弹出框中input框的宽度
                formLabelWidth: '180px',
                //验证规则
                rules: {
                    ename: [
                        {required: true, message: '请输入员工姓名', trigger: 'blur'},
                    ],
                    phoneNumber: [
                        {required: true, message: '请输入员工联系方式', trigger: 'blur'},
                        { validator: checkMobile, trigger: 'blur' }
                    ],
                    dno: [
                        {required: true, message: '请选择部门', trigger: 'blur'},
                    ],
                    position: [
                        {required: true, message: '请选择员工职位', trigger: 'blur'},
                    ],
                    pwd: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                    ],
                },
            }
        },
        methods:{
            getDeptList(){
                //从后台获取全部的部门信息
                this.$axios.get("getAllDept").then(res => {
                    this.deptList = res.data
                })
            },
            //获取全部的员工信息
            getEmpList() {
                this.$axios.post('getEmpByPage', this.queryMap).then(res => {
                    /*res表示返回的全部信息
                    * res.data代表返回的map*/
                    this.empList = res.data.data
                    this.total = res.data.count
                }).catch(() => {
                    this.$message.error("无法获取员工信息，服务器错误")
                })
            },

            /**
             * 条件查询
             */
            query() {
                this.queryMap.page = 1
                this.getEmpList()

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
                this.getEmpList()
            },
            /*当每页显示条数发生变化时触发*/
            handleSizeChange(val) {
                this.queryMap.limit = val
                this.queryMap.page = 1
                this.getEmpList()
            },
            /**
             * 打开新增员工的弹出框
             */
            openAddDialog() {
                //打开弹出框
                this.dialogFormVisible = true
                this.formTitle = "新增员工信息"
                //信息清空
                this.empForm = {
                    eno: '',
                    ename: '',
                    sex: '男',
                    phoneNumber: '',
                    dno: '',
                    pwd:'',
                    position:""
                }

                //清空所有的提示信息
                //第一次打开弹框时，dialog元素还未完全渲染到页面中
                //通过this.$refs['empForm']获取到的节点是undefined
                if (this.$refs['empForm'] !== undefined) {
                    //第二次打开时清除校验信息
                    this.$refs['empForm'].resetFields()
                }
            },

            /**
             * 表格选中项发生变化时触发，可以通过该方法得到当前的选中记录
             */
            selectChange(val) {
                this.checkedData = val
            },

            /**
             * 根据员工变化获取员工信息，然后再打开弹框显示员工信息
             */
            openEditDialog() {
                //判断用户是否只勾选了一条数据
                if (this.checkedData.length !== 1) {
                    this.$message.warning("请选择一条信息进行修改")
                    return
                }

                //获取选中记录的员工编号
                let eno = this.checkedData[0].eno
                //调用后台，获取员工详细信息
                this.$axios.get("getEmpByEno/" + eno).then(res => {
                    //返回的员工对象赋值给empForm
                    this.empForm = res.data
                    //展示弹框
                    this.dialogFormVisible = true
                    //清空校验信息
                    //第一次打开弹框时，dialog元素还未完全渲染到页面中
                    //通过this.$refs['empForm']获取到的节点是undefined
                    if (this.$refs['empForm'] !== undefined) {
                        //第二次打开时清除校验信息
                        this.$refs['empForm'].resetFields()
                    }
                    //修改标题
                    this.formTitle = "修改员工信息"
                })
            },
            /**
             * 保存员工信息
             */
            saveOrUpdateEmp() {
                //首先进行表单验证，验证通过后才能调用后台
                this.$refs['empForm'].validate(valid => {
                    //val代表校验结果，是布尔类型
                    if (valid) {
                        //调用后台
                        if (this.empForm.eno !== '') {
                            //修改
                            this.$axios.post("editEmp", this.empForm).then(res => {
                                if (res.data === true) {
                                    //如果新增成功，关闭弹框
                                    this.dialogFormVisible = false
                                    //刷新表格
                                    this.getEmpList()
                                    this.$message.success("员工修改成功")
                                } else {
                                    this.$message.error("员工修改失败，请联系管理员")
                                }
                            }).catch(() => {
                                this.$message.error("员工修改失败，请联系管理员")
                            })
                        } else {
                            //新增
                            this.$axios.post("addEmp", this.empForm).then(res => {
                                if (res.data === true) {
                                    //如果新增成功，关闭弹框
                                    this.dialogFormVisible = false
                                    //刷新表格
                                    this.getEmpList()
                                    this.$message.success("员工新增成功")
                                } else {
                                    this.$message.error("员工新增失败，请联系管理员")
                                }
                            }).catch(() => {
                                this.$message.error("员工新增失败，请联系管理员")
                            })
                        }

                    }
                })
            },


            /**
             * 批量删除
             */
            delEmp(){
                if (this.checkedData.length === 0) {
                    this.$message.warning("请选择要删除的记录")
                    return
                }
                //获取用户选中的员工编号，放到数组中
                let enos = []

                for (let i = 0; i < this.checkedData.length; i++) {
                    enos.push(this.checkedData[i].eno)
                }

                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //调用后台
                    this.$axios.post("delEmpBatch",enos).then(res => {
                        if (res.data === true) {
                            //刷新表格
                            this.getEmpList()
                            this.$message.success("员工删除成功")
                        } else {
                            this.$message.error("员工删除失败，请联系管理员")
                        }
                    }).catch(()=>{
                        this.$message.error("员工删除失败，请联系管理员")
                    })
                })


            }
        },
        created() {
            //页面一进来就去获取全部的部门信息
            this.getDeptList()
            //页面一进来就去获取全部的员工信息
            this.query()
        }
    }
</script>

<style scoped>

</style>