<template>
    <div class="login-page">
        <el-card class="box-card">
            <div slot="header" class="clearfix">
                <span class="login-title">🔐报工管理系统</span>
            </div>
            <div class="login-form">
                <el-form :model="loginForm" :rules="loginRules" ref="loginForm">
                    <el-form-item prop="eno">
                        <el-input type="text" v-model="loginForm.eno" auto-complete="off" placeholder="请输入工号">
                            <template slot="prepend"><i style="font-size:20px" class="el-icon-user"></i></template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="pwd">
                        <el-input type="password" v-model="loginForm.pwd" auto-complete="off" placeholder="请输入密码" show-password>
                            <template slot="prepend"><i style="font-size:20px" class="el-icon-key"></i></template>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button style="width:100%;" type="primary" @click="handleLogin" :loading="loading">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "Login",
        data(){
            return {
                loading: false,
                loginForm:{
                    eno: '',
                    pwd: ''
                },
                loginRules:{
                    eno: [
                        { required: true, message: '请输入账户', trigger: 'blur' },
                    ],
                    pwd: [
                        { required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                }
            }
        },
        methods:{
            handleLogin(){
                this.$refs['loginForm'].validate((valid) => {
                    //验证结束后返回的结果，这是一个boolean
                    if (valid) {
                        //将信息提交到后台进行校验操作
                        //post请求方式，第一个参数是路径信息，第二个参数是请求参数
                        //后台执行成功后回来执行then方法，相当于成功的回调
                        //catch是后台执行失败的回调
                        this.$axios.post('login',this.loginForm).then((res) => {
                            if (res.data !== 'wrong') {
                                //存储工号信息
                                sessionStorage.setItem('eno',this.loginForm.eno)
                                //将用户名存到store仓库中
                                this.$store.dispatch("saveEno",this.loginForm.eno)

                                //登录成功
                                if (res.data === 'admin') {
                                    this.$router.push({
                                        path:"/adminIndex"
                                    })
                                }else {
                                    //将用户角色存到session
                                    sessionStorage.setItem('position',res.data)
                                    this.$router.push({
                                        path:"/empIndex"
                                    })
                                }

                            } else {
                                this.$message.error("用户名或密码错误")
                            }
                        }).catch(() => {
                            this.$message.error("服务器错误")
                        })
                    } else {
                        this.$message.warning("用户名或密码不可为空")
                        return false;
                    }
                });
            }
        },
    }
</script>

<style scoped>
    .login-page{
        background-image: linear-gradient(180deg, #2af598 0%, #009efd 100%);
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .login-title{
        font-size: 20px;
    }

    .box-card {
        width: 375px;
    }

</style>