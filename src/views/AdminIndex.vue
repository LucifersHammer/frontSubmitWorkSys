<template>
    <div>
        <el-container>
            <el-header>
                <span>报工系统</span>
                <div>
                    <span>{{eno}}</span>
                    <span @click="logOut">退出</span>
                </div>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <!--左侧导航栏-->
                    <!--default-active让某个菜单高亮显示-->
                    <el-menu
                            default-active="$route.path"
                            class="el-menu-vertical-demo"
                            :router="true">
                        <!--:router="true" 开启路由模式
                        当点击菜单时，会将具体某个菜单的index属性作为path-->
                        <el-menu-item index="/empList">
                            <i class="el-icon-user"></i>
                            <span slot="title">员工信息列表</span>
                        </el-menu-item>
                        <el-menu-item index="/deptList">
                            <i class="el-icon-s-home"></i>
                            <span slot="title">部门信息列表</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main>
                    <!--主题内容区域-->
                    <router-view/>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "AdminIndex",
        data(){
            return{
                eno:''
            }
        },
        methods:{
            logOut(){
                //清除用户信息，并跳转到登录页面
                sessionStorage.clear()
                //清除vuex中的用户信息
                this.$store.dispatch("saveEno",'')
                this.$router.push({
                    path:"/"
                })
            }
        },
        created() {
            this.eno = sessionStorage.getItem("eno")
        }
    }
</script>

<style scoped>
    .el-main {
        background-color: #eaedf1;
    }
    .el-container {
        height: 100%;
    }
    /*头部样式*/
    .el-header {
        background-color: #4CA9EE;
        display: flex;
        /*左右贴边*/
        justify-content: space-between;
        padding-left: 0;
        align-items: center;
        color: #fff;
        font-size: 20px;
    }
    .el-header>div {
        display: flex;
        align-items: center;
    }
    .el-header>div>span {
        cursor: pointer;
    }
    .el-header span {
        margin-left: 15px;
    }
</style>