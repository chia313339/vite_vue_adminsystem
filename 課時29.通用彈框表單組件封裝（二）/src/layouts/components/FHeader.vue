<template>
    <div class="f-header">
        <span class="logo">
            <el-icon class="mr-1">
                <eleme-filled />
            </el-icon>
            帝莎编程
        </span>
        <el-icon class="icon-btn">
            <fold />
        </el-icon>
        <el-tooltip effect="dark" content="刷新" placement="bottom">
            <el-icon class="icon-btn" @click="handleRefresh">
                <refresh />
            </el-icon>
        </el-tooltip>

        <div class="ml-auto flex items-center">
            <el-tooltip effect="dark" content="全屏" placement="bottom">
                <el-icon class="icon-btn" @click="toggle">
                    <full-screen v-if="!isFullscreen" />
                    <aim v-else />
                </el-icon>
            </el-tooltip>

            <el-dropdown class="dropdown" @command="handleCommand">
                <span class="flex items-center text-light-50">
                    <el-avatar class="mr-2" :size="25" :src="$store.state.user.avatar" />
                    {{ $store.state.user.username }}
                    <el-icon class="el-icon--right">
                        <arrow-down />
                    </el-icon>
                </span>
                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item command="rePassword">修改密码</el-dropdown-item>
                        <el-dropdown-item command="logout">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </div>

    <form-drawer ref="formDrawerRef" title="修改密码" destroyOnClose @submit="onSubmit">
        <el-form ref="formRef" :rules="rules" :model="form" label-width="80px" size="small">
            <el-form-item prop="oldpassword" label="旧密码">
                <el-input v-model="form.oldpassword" placeholder="请输入旧密码"></el-input>
            </el-form-item>
            <el-form-item prop="password" label="新密码">
                <el-input type="password" v-model="form.password" placeholder="请输入密码" show-password></el-input>
            </el-form-item>
            <el-form-item prop="repassword" label="确认密码">
                <el-input type="password" v-model="form.repassword" placeholder="请输入确认密码" show-password></el-input>
            </el-form-item>
        </el-form>
    </form-drawer>

</template>
<script setup>
import { ref, reactive } from 'vue'
import FormDrawer from '~/components/FormDrawer.vue'
import { logout,updatepassword } from "~/api/manager"
import { showModal, toast } from "~/composables/util"
import { useRouter } from "vue-router"
import { useStore } from "vuex"
import { useFullscreen } from '@vueuse/core'
const {
    // 是否全屏状态
    isFullscreen,
    // 切换全屏
    toggle
} = useFullscreen()

const router = useRouter()
const store = useStore()

// 修改密码
const formDrawerRef = ref(null)
const form = reactive({
    oldpassword:"",
    password: "",
    repassword:""
})

const rules = {
    oldpassword: [
        {
            required: true,
            message: '旧密码不能为空',
            trigger: 'blur'
        },
    ],
    password: [
        {
            required: true,
            message: '新密码不能为空',
            trigger: 'blur'
        },
    ],
    repassword: [
        {
            required: true,
            message: '确认密码不能为空',
            trigger: 'blur'
        },
    ]
}

const formRef = ref(null)
const onSubmit = () => {
    formRef.value.validate((valid) => {
        if (!valid) {
            return false
        }
        formDrawerRef.value.showLoading()
        updatepassword(form)
        .then(res=>{
            toast("修改密码成功，请重新登录")
            store.dispatch("logout")
            // 跳转回登录页
            router.push("/login")
        })
        .finally(()=>{
            formDrawerRef.value.hideLoading()
        })

    })
}


const handleCommand = (c) => {
    switch (c) {
        case "logout":
            handleLogout()
            break;
        case "rePassword":
            // showDrawer.value = true
            formDrawerRef.value.open()
            break;
    }
}

// 刷新
const handleRefresh = () => location.reload()


function handleLogout() {
    showModal("是否要退出登录？").then(res => {
        logout()
            .finally(() => {

                store.dispatch("logout")
                // 跳转回登录页
                router.push("/login")
                // 提示退出登录成功
                toast("退出登录成功")
            })
    })
}
</script>
<style>
.f-header {
    @apply flex items-center bg-indigo-700 text-light-50 fixed top-0 left-0 right-0;
    height: 64px;
}

.logo {
    width: 250px;
    @apply flex justify-center items-center text-xl font-thin;
}

.icon-btn {
    @apply flex justify-center items-center;
    width: 42px;
    height: 64px;
    cursor: pointer;
}

.icon-btn:hover {
    @apply bg-indigo-600;
}

.f-header .dropdown {
    height: 64px;
    cursor: pointer;
    @apply flex justify-center items-center mx-5;
}
</style>