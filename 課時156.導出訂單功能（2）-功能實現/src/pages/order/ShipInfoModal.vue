<template>
    <el-drawer title="物流信息" v-model="dialogVisible" size="40%">
    </el-drawer>
</template>
<script setup>
import { ref } from "vue"
import { 
    getShipInfo
} from "~/api/order"
const dialogVisible = ref(false)

const open = (id)=>{
    return getShipInfo(id).then(res=>{
        console.log(res)
        dialogVisible.value = true
    })
}

defineExpose({
    open
})

</script>