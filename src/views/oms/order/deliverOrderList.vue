<template>
    <div class="app-container">
        <el-page-header @back="cancel">
            <template #icon>
                <el-icon><ElIconArrowLeft /></el-icon>
            </template>
            <template #content>
                <span class="text-large font-600 mr-3">发货列表</span>
            </template>
        </el-page-header>

        <div class="table-container">
            <el-table ref="deliverOrderTable" style="width: 100%" :data="list" border>
                <el-table-column label="订单编号" width="180">
                    <template v-slot="scope">{{ scope.row.orderSn }}</template>
                </el-table-column>
                <el-table-column label="收货人" width="180">
                    <template v-slot="scope">{{ scope.row.receiverName }}</template>
                </el-table-column>
                <el-table-column label="手机号码" width="160">
                    <template v-slot="scope">{{ scope.row.receiverPhone }}</template>
                </el-table-column>
                <el-table-column label="邮政编码" width="160">
                    <template v-slot="scope">{{ scope.row.receiverPostCode }}</template>
                </el-table-column>
                <el-table-column label="收货地址" width="180">
                    <template v-slot="scope">{{ scope.row.address }}</template>
                </el-table-column>
                <el-table-column label="配送方式" width="160">
                    <template v-slot="scope">
                        <el-select placeholder="请选择物流公司" v-model="scope.row.deliveryCompany">
                            <el-option v-for="item in companyOptions" :key="item" :label="item" :value="item">
                            </el-option>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="物流单号" width="180">
                    <template v-slot="scope">
                        <el-input v-model="scope.row.deliverySn"></el-input>
                    </template>
                </el-table-column>
            </el-table>
            <div style="margin-top: 16px; text-align: center">
                <el-button @click="cancel" type="primary">取消</el-button>
                <el-button @click="confirm" type="primary">确定</el-button>
            </div>
        </div>
    </div>
</template>

<script>
import { deliveryOrder } from '@/api/order';
const defaultLogisticsCompanies = ['顺丰快递', '圆通快递', '中通快递', '韵达快递'];

export default {
    name: 'deliverOrderList',
    data() {
        return {
            list: [],
            companyOptions: defaultLogisticsCompanies
        };
    },
    created() {
        this.list = history.state.list;

        //当list不为数组时转换为数组
        if (this.list instanceof Array === false) {
            this.list = [];
        }
    },
    methods: {
        cancel() {
            this.$router.back();
        },
        confirm() {
            this.$confirm('确定要发货吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    deliveryOrder(this.list).then((response) => {
                        this.$router.back();
                        this.$message({
                            type: 'success',
                            message: '发货成功!'
                        });
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消发货'
                    });
                });
        }
    }
};
</script>
