<template>
    <div v-loading="loading" class="bg-white p-4 rounded">
        <el-form :model="form" label-width="160px">
            <el-tabs v-model="activeName">
                <el-tab-pane label="支付设置" name="first">
                    <el-table :data="tableData" border stripe>
                        <el-table-column label="支付方式" align="left">
                            <template #default="{ row }">
                                <div class="flex items-center">
                                    <el-image :src="row.src" fit="fill" :lazy="true"
                                    style="width:40px;height: 40px;"
                                    class="rounded mr-2"></el-image>
                                    <div>
                                        <h6>{{ row.name }}</h6>
                                        <small class="flex text-gray-500 mt-1">{{row.desc }}</small>
                                    </div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" align="center" width="150">
                            <template #default="{ row }">
                                <el-button type="primary" size="small" text @click="open(row.key)">配置</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="购物设置" name="second">
                    <!-- <el-form-item label="默认上传方式">
            <el-radio-group v-model="form.upload_method">
              <el-radio label="oss" border>
                对象存储
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="Bucket">
            <el-input v-model="form.upload_config.Bucket" placeholder="Bucket" style="width: 30%;"></el-input>
          </el-form-item>
          <el-form-item label="ACCESS_KEY">
            <el-input v-model="form.upload_config.ACCESS_KEY" placeholder="ACCESS_KEY" style="width: 30%;"></el-input>
          </el-form-item>
          <el-form-item label="SECRET_KEY">
            <el-input v-model="form.upload_config.SECRET_KEY" placeholder="SECRET_KEY" style="width: 30%;"></el-input>
          </el-form-item>
          <el-form-item label="空间域名">
            <el-input v-model="form.upload_config.http" placeholder="空间域名" style="width: 30%;"></el-input>
            <small class="text-gray-500 flex mt-1">请补全 http:// 或 https://</small>
          </el-form-item> -->
                    <el-form-item>
                        <el-button type="primary" size="default" @click="submit">保存</el-button>
                    </el-form-item>
                </el-tab-pane>
            </el-tabs>
        </el-form>

        <FormDrawer ref="formDrawerRef" title="配置" @submit="submit">
            <el-form v-if="drawerType == 'alipay'" :model="form" label-width="80px">
                <el-form-item label="app_id">
                    <el-input v-model="form.alipay.app_id" placeholder="app_id" style="width:90%;"></el-input>
                </el-form-item>
                <el-form-item label="ali_public_key">
                    <el-input v-model="form.alipay.ali_public_key" placeholder="ali_public_key" style="width:90%;"
                    type="textarea" rows="4"></el-input>
                </el-form-item>
                <el-form-item label="private_key">
                    <el-input v-model="form.alipay.private_key" placeholder="private_key" style="width:90%;"
                    type="textarea" rows="4"></el-input>
                </el-form-item>
            </el-form>
            <el-form v-else :model="form" label-width="80px">
                <el-form-item label="公众号 APPID">
                    <el-input v-model="form.wxpay.app_id" placeholder="app_id" style="width:90%;"></el-input>
                </el-form-item>
                <el-form-item label="小程序 APPID">
                    <el-input v-model="form.wxpay.miniapp_id" placeholder="miniapp_id" style="width:90%;"></el-input>
                </el-form-item>
                <el-form-item label="小程序 secret">
                    <el-input v-model="form.wxpay.secret" placeholder="secret" style="width:90%;"></el-input>
                </el-form-item>
                <el-form-item label="appid">
                    <el-input v-model="form.wxpay.appid" placeholder="appid" style="width:90%;"></el-input>
                </el-form-item>
                <el-form-item label="商户号">
                    <el-input v-model="form.wxpay.mch_id" placeholder="商户号" style="width:90%;"></el-input>
                </el-form-item>
                <el-form-item label="API 密钥">
                    <el-input v-model="form.wxpay.key" placeholder="API 密钥" style="width:90%;"></el-input>
                </el-form-item>
                <el-form-item label="cert_client">
                    <el-upload
                        :action="uploadAction"
                        :headers="{
                            token
                        }"
                        accept=".pem"
                        :limit="1"
                        :on-success="uploadClientSuccess"
                    >
                        <el-button type="primary">点击上传</el-button>
                        <template #tip>
                        <p class="text-red-500">
                            {{ form.wxpay.cert_client ?  form.wxpay.cert_client : '还未配置'}}
                        </p>
                        <div class="el-upload__tip">
                            例如：apiclient_cert.pem
                        </div>
                        </template>
                    </el-upload>
                </el-form-item>
                <el-form-item label="cert_key">
                    <el-upload
                        :action="uploadAction"
                        :headers="{
                            token
                        }"
                        accept=".pem"
                        :limit="1"
                        :on-success="uploadKeySuccess"
                    >
                        <el-button type="primary">点击上传</el-button>
                        <template #tip>
                        <p class="text-red-500">
                            {{ form.wxpay.cert_key ?  form.wxpay.cert_key : '还未配置'}}
                        </p>
                        <div class="el-upload__tip">
                            例如：apiclient_key.pem
                        </div>
                        </template>
                    </el-upload>
                </el-form-item>
            </el-form>
        </FormDrawer>

    </div>
</template>
<script setup>
import { ref, reactive } from "vue"
import { getSysconfig, setSysconfig,uploadAction } from "~/api/sysconfig"
import { toast } from "~/composables/util";
import { getToken } from "~/composables/auth"
import FormDrawer from "~/components/FormDrawer.vue";
const token = getToken()
const activeName = ref("first")
const tableData = [{
    name:"支付宝支付",
    desc:"该系统支持即时到账接口",
    src:"/alipay.png",
    key:"alipay"
},{
    name:"微信支付",
    desc:"该系统支持微信网页支付和扫码支付",
    src:"/wepay.png",
    key:"wxpay"
}]
const form = reactive({
    "close_order_minute": 30,
    "auto_received_day": 7,
    "after_sale_day": 23,
    "alipay": {
        "app_id": "****已配置****",
        "ali_public_key": "****已配置****",
        "private_key": "****已配置****"
    },
    "wxpay": {
        "app_id": "****已配置****",
        "miniapp_id": "****已配置****",
        "secret": "****已配置****",
        "appid": "****已配置****",
        "mch_id": "****已配置****",
        "key": "****已配置****",
        "cert_client": "****已配置****.pem",
        "cert_key": "****已配置****.pem"
    },
})

const loading = ref(false)
function getData() {
    loading.value = true
    getSysconfig().then(res => {
        for (const k in form) {
            form[k] = res[k]
        }
        form.password_encrypt = form.password_encrypt.split(",")
    }).finally(() => {
        loading.value = false
    })
}

getData()

const submit = () => {
    loading.value = true
    setSysconfig({
        ...form,
    }).then(res => {
        toast("修改成功")
        getData()
    }).finally(() => {
        loading.value = false
    })
}

const drawerType = ref("alipay")
const formDrawerRef = ref(null)
const open = (key)=>{
    drawerType.value = key
    formDrawerRef.value.open()
}

function uploadClientSuccess(response, uploadFile, uploadFiles){
    form.wxpay.cert_client = response.data
}

function uploadKeySuccess(response, uploadFile, uploadFiles){
    form.wxpay.cert_key = response.data
}
</script>