<template>
    <el-form-item label="规格选项">
        <el-card shadow="never" class="w-full mb-3">
            <template #header>
                <div class="flex items-center">
                    <el-input placeholder="规格名称" style="width:200px;">
                        <template #append>
                            <el-icon><more/></el-icon>
                        </template>
                    </el-input>
                    <el-button class="ml-auto" size="small"><el-icon><Top /></el-icon></el-button>
                    <el-button size="small"><el-icon><Bottom /></el-icon></el-button>
                    <el-button size="small"><el-icon><Delete /></el-icon></el-button>
                </div>
            </template>
            <SkuCardItem/>
        </el-card>
        <el-button type="success" size="small">添加规格</el-button>
        
    </el-form-item>
</template>
<script setup>
import SkuCardItem from './SkuCardItem.vue';

</script>
<style>
.el-card__header {
    @apply !p-2 bg-gray-50;
}
</style>