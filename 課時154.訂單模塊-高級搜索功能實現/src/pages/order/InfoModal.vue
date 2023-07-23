<template>
    <el-drawer title="订单详情" v-model="dialogVisible" size="50%">
        <el-card shadow="never" class="mb-3">
            <template #header>
                <b class="text-sm">订单详情</b>
            </template>
            <el-form label-width="80px">
                <el-form-item label="订单号">
                   {{ info.no }}
                </el-form-item>
                <el-form-item label="付款方式">
                    {{ info.payment_method }}
                </el-form-item>
                <el-form-item label="付款时间">
                     {{ info.paid_time }}
                </el-form-item>
                <el-form-item label="创建时间">
                     {{ info.create_time }}
                </el-form-item>
            </el-form>
        </el-card>

        <el-card shadow="never" class="mb-3">
            <template #header>
                <b class="text-sm">商品信息</b>
            </template>
            <div class="flex mb-2" v-for="(item,index) in info.order_items" :key="index">
                <el-image :src="item.goods_item?.cover ?? ''" fit="fill" :lazy="true" style="width:60px;height:60px;"></el-image>
                <div class="ml-2 text-sm">
                    <p>{{ item.goods_item?.title ?? '商品已被删除' }}</p>
                    <p v-if="item.sku_type == 1 && item.goods_skus" class="mt-1">
                       <el-tag type="info" size="small">
                        {{ (item.goods_skus.skus.map(o=>o.value)).join(",") }}
                       </el-tag>
                    </p>
                    <p>
                        <b class="text-rose-500 mr-2">￥{{ item.price }}</b>
                        <span class="text-xs text-gray-500">x{{ item.num }}</span>
                    </p>
                </div>
            </div>
        </el-card>

        <el-card shadow="never" v-if="info.address">
            <template #header>
                <b class="text-sm">收货信息</b>
            </template>
            <el-form label-width="80px">
                <el-form-item label="收货人">
                   {{ info.address.name }}
                </el-form-item>
                <el-form-item label="联系方式">
                    {{ info.address.phone }}
                </el-form-item>
                <el-form-item label="收货地址">
                     {{ info.address.province + info.address.city + info.address.district + info.address.address }}
                </el-form-item>
            </el-form>
        </el-card>
        
    </el-drawer>
</template>
<script setup>
import { ref } from "vue"

const props = defineProps({
    info:Object
})

const dialogVisible = ref(false)

const open = ()=>{
    dialogVisible.value = true
    console.log(props.info)
}

defineExpose({
    open
})
</script>