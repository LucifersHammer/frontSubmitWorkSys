<template>
    <div>
        <el-container>
            <el-header>
                <span>报工系统</span>
                <div>
                    <span>{{ename}}</span>
                    <span @click="logOut">退出</span>
                </div>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <!--左侧导航栏-->
                    <!--default-active让某个菜单高亮显示-->
                    <el-menu
                            :default-active="activeIndex"
                            class="el-menu-vertical-demo"
                            :router="true">
                        <!--:router="true" 开启路由模式
                        当点击菜单时，会将具体某个菜单的index属性作为path-->
                        <el-menu-item v-for="empMenu in empMenus"
                                      :index="empMenu.index"
                                      :key="empMenu.index"
                                      @click="addTab(empMenu)">
                            <span slot="title">{{empMenu.title}}</span>
                        </el-menu-item>
                        <el-menu-item v-if="position === '部门经理'"
                                      v-for="mgrMenu in mgrMenus"
                                      :index="mgrMenu.index"
                                      :key="mgrMenu.index"
                                      @click="addTab(mgrMenu)">
                            <span slot="title">{{mgrMenu.title}}</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-main>
                    <!--主题内容区域
                    <router-view/>-->
                    <!-- 标签栏 -->
                    <div class="tabs">
                        <el-tabs v-model="activeIndex" @tab-remove="removeTab">
                            <!-- :closable 首页不可关闭 -->
                            <el-tab-pane
                                    v-for="item in openTab"
                                    :key="item.title"
                                    :label="item.title"
                                    :name="item.index"
                                    :closable="item.title !== '首页' ">

                                <div>
                                    <!-- keep-alive 保持路由状态 -->
                                    <keep-alive>
                                        <router-view></router-view>
                                    </keep-alive>
                                </div>

                            </el-tab-pane>
                        </el-tabs>
                    </div>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    export default {
        name: "EmpIndex",
        data(){
            return{
                eno:'',
                ename:'',
                position:'',
                empMenus:[
                    {
                        index:"/empHome",
                        title:"首页"
                    },
                    {
                        index:"/submitMission",
                        title:"报工填报"
                    },
                    {
                        index:"/selfOmission",
                        title:"个人漏报记录"
                    },
                    {
                        index:"/selfRecords",
                        title:"个人报工记录"
                    },
                ],
                mgrMenus:[
                    {
                        index:"/deptAudit",
                        title:"部门审核"
                    },
                    {
                        index:"/deptRecords",
                        title:"部门报工汇总"
                    },
                    {
                        index:"/deptOmission",
                        title:"漏报汇总"
                    },
                ],
            }
        },
        methods:{
            logOut(){
                //清除用户信息，并跳转到登录页面
                sessionStorage.clear()
                //清除vuex中的用户信息
                this.$store.dispatch("saveEno",'')

                //清除标签页
                this.$store.state.openTab = [
                    {title: "首页", index: "/empHome" }
                ]
                this.$store.state.activeIndex = "/empHome"

                this.$router.push({
                    path:"/"
                })
            },
            // 从状态管理中获取方法 添加标签页方法
            addTab(data) {
                this.$store.commit("addTab", data);
            },
            // 删除tab，直接在elementUI官网复制的，改了变量名
            removeTab(targetName) {
                let tabs = this.openTab;
                let activeIndex = this.activeIndex;
                if (activeIndex === targetName) {
                    tabs.forEach((tab, index) => {
                        if (tab.index === targetName) {
                            let nextTab = tabs[index + 1] || tabs[index - 1];
                            if (nextTab) {
                                activeIndex = nextTab.index;
                            }
                        }
                    });
                }

                this.activeIndex = activeIndex;
                this.openTab = tabs.filter((tab) => tab.index !== targetName);
            },
        },
        // 计算属性 从状态管理中获取的数据，因为需要获取和设置store中的数据，所以需要用 get 和 set
        computed: {
            // 已打开的标签页
            openTab: {
                get: function () {
                    return this.$store.state.openTab;
                },
                // 用于删除标签页时将删除后的数据传回store
                set: function (newValue) {
                    // console.log(newValue);
                    this.$store.state.openTab = newValue;
                },
            },
            // 当前标签页
            activeIndex: {
                get: function () {
                    return this.$store.state.activeIndex;
                },
                set: function (newValue) {
                    // 当前标签页变化时触发
                    this.$store.state.activeIndex = newValue;
                    this.$router.push(newValue);
                },
            },
        },
        created() {
            this.eno = sessionStorage.getItem("eno")
            this.position = sessionStorage.getItem("position")
            this.$axios.get("getEmpByEno/" + this.eno).then(res => {
                this.ename = res.data.ename
                sessionStorage.setItem('ename',this.ename)
            })
            //避免页面刷新后内容和标签不匹配,直接定位到首页
            if(this.$router.path !== '/empIndex'){
                this.$router.replace('/empHome')
            }
        }
    }
</script>

<style scoped>
    .el-main {
        background-color: #ffffff;
    }
    .el-container {
        height: 800px;
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