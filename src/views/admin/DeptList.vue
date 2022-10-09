<template>
    <div>
        <el-row>
            <el-col :span="15">
                <!--部门信息的查询条件及查询按钮-->
                <el-form :inline="true" :model="queryMap" class="demo-form-inline" align="left">
                    <el-form-item label="部门名称">
                        <el-input v-model="queryMap.dname" clearable placeholder="部门名称"></el-input>
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
                    <el-button type="primary" icon="el-icon-delete" @click="delDept">删除</el-button>
                </el-button-group>
            </el-col>
        </el-row>


        <!--部门信息的列表-->
        <!--data  代表表格要显示的数据-->
        <el-table
                :data="deptList"
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
            <!--prop属性对应的部门对象的实体类属性-->
            <!--对应的是后台封装的map的key值-->
            <!--后台的map集合的key值由sql语句中的查询字段决定-->
            <el-table-column
                    prop="dno"
                    label="部门号"
                    align="center">
            </el-table-column>
            <el-table-column
                    prop="dname"
                    label="部门名称"
                    align="center">
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
            <el-form :model="deptForm" :rules="rules" ref="deptForm">
                <el-form-item label="部门名称" :label-width="formLabelWidth" align="left" prop="name">
                    <el-input v-model="deptForm.dname" autocomplete="off" style="width: 300px;"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveOrUpdateDept">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "DeptList",
        data(){
            return {
                /*绑定到了查询表单上*/
                queryMap:{
                    dname:'',
                    limit:10,
                    page:1
                },
                //要传给后台的表单(弹出框)
                deptForm: {
                    dno: '',
                    dname: '',
                },
                //所有的部门信息
                deptList:[],
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
                    dname: [
                        {required: true, message: '请输入部门名称', trigger: 'blur'},
                    ],
                },
            }
        },
        methods:{
            //获取部门信息
            getDeptList() {
                this.$axios.post('getDeptByPage', this.queryMap).then(res => {
                    /*res表示返回的全部信息
                    * res.data代表返回的map*/
                    this.deptList = res.data.data
                    this.total = res.data.count
                }).catch(() => {
                    this.$message.error("无法获取部门信息，服务器错误")
                })
            },

            /**
             * 条件查询
             */
            query() {
                this.queryMap.page = 1
                this.getDeptList()

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
                this.getDeptList()
            },
            /*当每页显示条数发生变化时触发*/
            handleSizeChange(val) {
                this.queryMap.limit = val
                this.queryMap.page = 1
                this.getDeptList()
            },
            /**
             * 打开新增部门的弹出框
             */
            openAddDialog() {
                //打开弹出框
                this.dialogFormVisible = true
                this.formTitle = "新增部门信息"
                //信息清空
                this.deptForm = {
                    dno: '',
                    dname: '',
                }

                //清空所有的提示信息
                //第一次打开弹框时，dialog元素还未完全渲染到页面中
                //通过this.$refs['deptForm']获取到的节点是undefined
                if (this.$refs['deptForm'] !== undefined) {
                    //第二次打开时清除校验信息
                    this.$refs['deptForm'].resetFields()
                }
            },

            /**
             * 表格选中项发生变化时触发，可以通过该方法得到当前的选中记录
             */
            selectChange(val) {
                this.checkedData = val
            },

            /**
             * 根据选择项变化获取部门信息，然后再打开弹框显示部门信息
             */
            openEditDialog() {
                //判断用户是否只勾选了一条数据
                if (this.checkedData.length !== 1) {
                    this.$message.warning("请选择一条信息进行修改")
                    return
                }

                //获取选中记录的部门编号
                let dno = this.checkedData[0].dno
                //调用后台，获取部门详细信息
                this.$axios.get('getDeptByDno/' + dno).then(res => {
                    //返回的部门对象赋值给deptForm
                    this.deptForm = res.data
                    //展示弹框
                    this.dialogFormVisible = true
                    //清空校验信息
                    //第一次打开弹框时，dialog元素还未完全渲染到页面中
                    //通过this.$refs['deptForm']获取到的节点是undefined
                    if (this.$refs['deptForm'] !== undefined) {
                        //第二次打开时清除校验信息
                        this.$refs['deptForm'].resetFields()
                    }
                    //修改标题
                    this.formTitle = "修改部门信息"
                })

            },
            /**
             * 保存部门信息
             */
            saveOrUpdateDept() {
                //首先进行表单验证，验证通过后才能调用后台
                this.$refs['deptForm'].validate(valid => {
                    //val代表校验结果，是布尔类型
                    if (valid) {
                        //调用后台
                        if (this.deptForm.dno !== '') {
                            //修改
                            this.$axios.post("insertOrUpdateDept", this.deptForm).then(res => {
                                if (res.data === true) {
                                    //如果新增成功，关闭弹框
                                    this.dialogFormVisible = false
                                    //刷新表格
                                    this.getDeptList()
                                    this.$message.success("部门修改成功")
                                } else {
                                    this.$message.error("部门修改失败，请联系管理员")
                                }
                            }).catch(() => {
                                this.$message.error("部门修改失败，请联系管理员")
                            })
                        } else {
                            //新增
                            this.$axios.post("insertOrUpdateDept", this.deptForm).then(res => {
                                if (res.data === true) {
                                    //如果新增成功，关闭弹框
                                    this.dialogFormVisible = false
                                    //刷新表格
                                    this.getDeptList()
                                    this.$message.success("部门新增成功")
                                } else {
                                    this.$message.error("部门新增失败，请联系管理员")
                                }
                            }).catch(() => {
                                this.$message.error("部门新增失败，请联系管理员")
                            })
                        }

                    }
                })
            },


            /**
             * 批量删除
             */
            delDept(){
                if (this.checkedData.length === 0) {
                    this.$message.warning("请选择要删除的记录")
                    return
                }
                //获取用户选中的部门编号，放到数组中
                let dnos = []

                for (let i = 0; i < this.checkedData.length; i++) {
                    dnos.push(this.checkedData[i].dno)
                }

                this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    //调用后台
                    this.$axios.post("delDeptBatch",dnos).then(res => {
                        console.log(res.data)
                        if (res.data === "success") {
                            //刷新表格
                            this.getDeptList()
                            this.$message.success("部门删除成功")
                        } else if (res.data === "warn"){
                            this.getDeptList()
                            this.$message.success("部分删除成功,部分部门下有员工和项目,无法删除")
                        } else if (res.data === "none") {
                            this.$message.warning("删除失败,所选部门下有员工和项目,无法删除")
                        } else {
                            this.$message.error("部门删除失败，请联系管理员")
                        }
                    }).catch(()=>{
                        this.$message.error("部门删除失败，请联系管理员")
                    })
                })


            }
        },
        created() {
            //页面一进来就去获取全部的部门信息
            this.query()
        }
    }
</script>

<style scoped>

</style>