import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        //声明变量,用于存储用户数据
        eno: '',
        //所有打开的路由
        openTab: [
            {title: "首页", index: "/empHome"}
        ],
        // 激活状态，侧边导航和标签页的激活状态，初始为首页
        activeIndex: "/empHome",

    },
    getters: {},
    mutations: {
        //用于声明方法，用于操作state中的变量，类似于数据库的dao层
        setEno: function (state, eno) {
            //state代表的是上面声明的state对象
            //eno代表外部传递进来的参数
            state.eno = eno
        },

        // 点击导航栏时添加标签页
        addTab(state, data) {
            let flag = true
            for (let i = 0; i < state.openTab.length; i++) {
                if (state.openTab[i].title === data.title) {
                    flag = false
                    break
                }
            }
            if (state.openTab.indexOf(data) === -1 && flag) {
                state.openTab.push(data);
            }
            state.activeIndex = data.index;
        },
    },
    actions: {
        //这里的方法供外部的js调用
        //用来调用mutations层的方法，类似service层
        saveEno: function (context, eno) {
            //context代表的是上面的mutations对象，eno是外部参数
            context.commit("setEno", eno)
        }
    },
    modules: {}
})
