<template>
    <el-aside width="220px" class="image-aside" v-loading="loading">
        <div class="top">

            <AsideList :active="activeId == item.id" v-for="(item,index) in list" :key="index">
                {{ item.name }}
            </AsideList>

        </div>
        <div class="bottom">
            <el-pagination background layout="prev, next" :total="total" :current-page="currentPage" :page-size="limit" @current-change="getData"/>
        </div>
    </el-aside>

    <FormDrawer title="新增" ref="formDrawerRef" @submit="handleSubmit">
        <el-form :model="form" ref="formRef" :rules="rules" label-width="80px" :inline="false">
            <el-form-item label="分类名称" prop="name">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="排序" prop="order">
                <el-input-number v-model="form.order" :min="0" :max="1000"/>
            </el-form-item>
        </el-form>
    </FormDrawer>

</template>
<script setup>
import { reactive, ref } from "vue";
import FormDrawer from "./FormDrawer.vue"
import {
    getImageClassList
} from "~/api/image_class.js"
import AsideList from './AsideList.vue';

// 加载动画
const loading = ref(false)
const list = ref([])
const activeId = ref(0)

// 分页
const currentPage = ref(1)
const total = ref(0)
const limit = ref(10)

// 获取数据
function getData(p = null){
    if(typeof p == "number"){
        currentPage.value = p
    }

    loading.value = true
    getImageClassList(currentPage.value)
    .then(res=>{
        total.value = res.totalCount
        list.value = res.list
        let item = list.value[0]
        if(item){
            activeId.value = item.id
        }
    })
    .finally(()=>{
        loading.value = false
    })
}

getData()


const formDrawerRef = ref(null)
const handleCreate = ()=> formDrawerRef.value.open()

const form = reactive({
    name:"",
    order:50
})

const rules = {
    name:[{
        required: true,
        message: '图库分类名称不能为空',
        trigger: 'blur'
    }]
}
const formRef = ref(null)
const handleSubmit = ()=>{
    formRef.value.validate((valid)=>{
        if(!valid) return
        console.log("提交成功");
    })
}

defineExpose({
    handleCreate
})

</script>
<style>
.image-aside{
  border-right: 1px solid #eeeeee;
  position: relative;
}
.image-aside .top
{
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}
.image-aside .bottom
{
  position: absolute;
  bottom: 0;
  height: 50px;
  left: 0;
  right: 0;
  @apply flex items-center justify-center;
}

</style>