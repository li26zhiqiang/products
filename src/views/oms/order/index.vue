<template>
    <div>
        <div class="app-container" v-if="$route.matched.length <= 2">
            <el-card class="filter-container" shadow="never">
                <el-form :inline="true" :model="listQuery" label-width="90px">
                    <el-row :gutter="10">
                        <el-col :span="8">
                            <el-form-item label="输入搜索：">
                                <el-input
                                    v-model="listQuery.orderSn"
                                    class="input-width"
                                    placeholder="订单编号"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="收货人：">
                                <el-input
                                    v-model="listQuery.receiverKeyword"
                                    class="input-width"
                                    placeholder="收货人姓名/手机号码"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="提交时间：">
                                <el-date-picker
                                    class="input-width"
                                    v-model="listQuery.createTime"
                                    value-format="yyyy-MM-dd"
                                    type="date"
                                    placeholder="请选择时间"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="订单状态：">
                                <el-select v-model="listQuery.status" class="input-width" placeholder="全部" clearable>
                                    <el-option
                                        v-for="item in statusOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="订单分类：">
                                <el-select
                                    v-model="listQuery.orderType"
                                    class="input-width"
                                    placeholder="全部"
                                    clearable
                                >
                                    <el-option
                                        v-for="item in orderTypeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="订单来源：">
                                <el-select
                                    v-model="listQuery.sourceType"
                                    class="input-width"
                                    placeholder="全部"
                                    clearable
                                >
                                    <el-option
                                        v-for="item in sourceTypeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <div class="filter-operation">
                                <el-button style="float: right" type="primary" @click="handleSearchList()">
                                    查询
                                </el-button>
                                <el-button style="float: right; margin-right: 16px" @click="handleResetSearch()">
                                    重置
                                </el-button>
                            </div>
                        </el-col>
                    </el-row>
                </el-form>
            </el-card>

            <el-card class="operate-container" shadow="never">
                <div class="batch-operate-container">
                    <el-select v-model="operateType" placeholder="批量操作">
                        <el-option
                            v-for="item in operateOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    <el-button
                        style="margin-left: 8px"
                        class="search-button"
                        @click="handleBatchOperate()"
                        type="primary"
                    >
                        确定
                    </el-button>
                </div>
            </el-card>

            <div class="table-container">
                <el-table
                    ref="orderTable"
                    :data="list"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    v-loading="listLoading"
                    border
                >
                    <el-table-column type="selection" width="60"></el-table-column>
                    <el-table-column label="编号" width="80">
                        <template v-slot="scope">{{ scope.row.id }}</template>
                    </el-table-column>
                    <el-table-column label="订单编号" width="180">
                        <template v-slot="scope">{{ scope.row.orderSn }}</template>
                    </el-table-column>
                    <el-table-column label="提交时间" width="180">
                        <template v-slot="scope">{{ formatCreateTime_filter(scope.row.createTime) }}</template>
                    </el-table-column>
                    <el-table-column label="用户账号" width="120">
                        <template v-slot="scope">{{ scope.row.memberUsername }}</template>
                    </el-table-column>
                    <el-table-column label="订单金额" width="120">
                        <template v-slot="scope">￥{{ scope.row.totalAmount }}</template>
                    </el-table-column>
                    <el-table-column label="支付方式" width="120">
                        <template v-slot="scope">{{ formatPayType_filter(scope.row.payType) }}</template>
                    </el-table-column>
                    <el-table-column label="订单来源" width="120">
                        <template v-slot="scope">{{ formatSourceType_filter(scope.row.sourceType) }}</template>
                    </el-table-column>
                    <el-table-column label="订单状态" width="120">
                        <template v-slot="scope">{{ formatStatus_filter(scope.row.status) }}</template>
                    </el-table-column>
                    <el-table-column label="操作" width="180" fixed="right">
                        <template v-slot="scope">
                            <el-button link type="primary" @click="handleViewOrder(scope.$index, scope.row)">
                                查看订单
                            </el-button>
                            <el-button
                                link
                                type="primary"
                                @click="handleCloseOrder(scope.$index, scope.row)"
                                v-show="scope.row.status === 0"
                                >关闭订单</el-button
                            >
                            <el-button
                                link
                                type="primary"
                                @click="handleDeliveryOrder(scope.$index, scope.row)"
                                v-show="scope.row.status === 1"
                                >订单发货</el-button
                            >
                            <el-button
                                link
                                type="primary"
                                @click="handleViewLogistics(scope.$index, scope.row)"
                                v-show="scope.row.status === 2 || scope.row.status === 3"
                                >订单跟踪</el-button
                            >
                            <el-button
                                link
                                type="danger"
                                @click="handleDeleteOrder(scope.$index, scope.row)"
                                v-show="scope.row.status === 4"
                                >删除订单</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-container">
                    <el-pagination
                        background
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        layout="total, sizes,prev, pager, next,jumper"
                        v-model:current-page="listQuery.pageNum"
                        :page-size="listQuery.pageSize"
                        :page-sizes="[10, 20, 50, 100]"
                        :total="total"
                    >
                    </el-pagination>
                </div>
            </div>

            <el-dialog title="关闭订单" v-model="closeOrder.dialogVisible" width="660px">
                <el-input
                    style="width: 100%"
                    type="textarea"
                    :rows="5"
                    placeholder="请输入备注信息"
                    v-model="closeOrder.content"
                >
                </el-input>
                <template v-slot:footer>
                    <span class="dialog-footer">
                        <el-button @click="closeOrder.dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="handleCloseOrderConfirm">确定</el-button>
                    </span>
                </template>
            </el-dialog>

            <logistics-dialog v-model:value="logisticsDialogVisible"></logistics-dialog>
        </div>

        <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
                <component :is="Component"></component>
            </transition>
        </router-view>
    </div>
</template>

<script>
import { fetchList, closeOrder, deleteOrder } from '@/api/order';
import { formatDate } from '@/utils/date';
import LogisticsDialog from '@/views/oms/order/components/logisticsDialog.vue';
const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    orderSn: null,
    receiverKeyword: null,
    status: null,
    orderType: null,
    sourceType: null,
    createTime: null
};
export default {
    name: 'orderList',
    components: { LogisticsDialog },
    data() {
        return {
            listQuery: Object.assign({}, defaultListQuery),
            listLoading: true,
            list: null,
            total: null,
            operateType: null,
            multipleSelection: [],
            closeOrder: {
                dialogVisible: false,
                content: null,
                orderIds: []
            },
            statusOptions: [
                {
                    label: '待付款',
                    value: 0
                },
                {
                    label: '待发货',
                    value: 1
                },
                {
                    label: '已发货',
                    value: 2
                },
                {
                    label: '已完成',
                    value: 3
                },
                {
                    label: '已关闭',
                    value: 4
                }
            ],
            orderTypeOptions: [
                {
                    label: '正常订单',
                    value: 0
                },
                {
                    label: '秒杀订单',
                    value: 1
                }
            ],
            sourceTypeOptions: [
                {
                    label: 'PC订单',
                    value: 0
                },
                {
                    label: 'APP订单',
                    value: 1
                }
            ],
            operateOptions: [
                {
                    label: '批量发货',
                    value: 1
                },
                {
                    label: '关闭订单',
                    value: 2
                },
                {
                    label: '删除订单',
                    value: 3
                }
            ],
            logisticsDialogVisible: false
        };
    },
    created() {
        this.getList();
    },
    methods: {
        formatStatus_filter(value) {
            if (value === 1) {
                return '待发货';
            } else if (value === 2) {
                return '已发货';
            } else if (value === 3) {
                return '已完成';
            } else if (value === 4) {
                return '已关闭';
            } else if (value === 5) {
                return '无效订单';
            } else {
                return '待付款';
            }
        },
        formatSourceType_filter(value) {
            if (value === 1) {
                return 'APP订单';
            } else {
                return 'PC订单';
            }
        },
        formatPayType_filter(value) {
            if (value === 1) {
                return '支付宝';
            } else if (value === 2) {
                return '微信';
            } else {
                return '未支付';
            }
        },
        formatCreateTime_filter(time) {
            let date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
        },
        handleResetSearch() {
            this.listQuery = Object.assign({}, defaultListQuery);
        },
        handleSearchList() {
            this.listQuery.pageNum = 1;
            this.getList();
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleViewOrder(index, row) {
            this.$router.push({ path: '/oms/order/orderDetail', query: { id: row.id } });
        },
        handleCloseOrder(index, row) {
            this.closeOrder.dialogVisible = true;
            this.closeOrder.orderIds = [row.id];
        },
        handleDeliveryOrder(index, row) {
            let listItem = this.covertOrder(row);

            console.log('listItem=', listItem);
            this.$router.push({
                name: 'deliverOrderList',
                state: { list: [listItem], name: 'test' }
            });
        },
        handleViewLogistics(index, row) {
            this.logisticsDialogVisible = true;
        },
        handleDeleteOrder(index, row) {
            let ids = [];
            ids.push(row.id);
            this.deleteOrder(ids);
        },
        handleBatchOperate() {
            if (this.multipleSelection == null || this.multipleSelection.length < 1) {
                this.$message({
                    message: '请选择要操作的订单',
                    type: 'warning',
                    duration: 1000
                });
                return;
            }
            if (this.operateType === 1) {
                //批量发货
                let list = [];

                for (let i = 0; i < this.multipleSelection.length; i++) {
                    if (this.multipleSelection[i].status === 1) {
                        list.push(this.covertOrder(this.multipleSelection[i]));
                    }
                }

                if (list.length === 0) {
                    this.$message({
                        message: '选中订单中没有可以发货的订单',
                        type: 'warning',
                        duration: 1000
                    });
                    return;
                }

                this.$router.push({
                    name: 'deliverOrderList',
                    state: { list: list }
                });
            } else if (this.operateType === 2) {
                //关闭订单
                this.closeOrder.orderIds = [];
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    this.closeOrder.orderIds.push(this.multipleSelection[i].id);
                }
                this.closeOrder.dialogVisible = true;
            } else if (this.operateType === 3) {
                //删除订单
                let ids = [];
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    ids.push(this.multipleSelection[i].id);
                }
                this.deleteOrder(ids);
            }
        },
        handleSizeChange(val) {
            this.listQuery.pageNum = 1;
            this.listQuery.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.pageNum = val;
            this.getList();
        },
        handleCloseOrderConfirm() {
            if (this.closeOrder.content == null || this.closeOrder.content === '') {
                this.$message({
                    message: '操作备注不能为空',
                    type: 'warning',
                    duration: 1000
                });
                return;
            }
            let params = new URLSearchParams();
            params.append('ids', this.closeOrder.orderIds);
            params.append('note', this.closeOrder.content);
            closeOrder(params).then((response) => {
                this.closeOrder.orderIds = [];
                this.closeOrder.dialogVisible = false;
                this.getList();
                this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000
                });
            });
        },
        getList() {
            this.listLoading = true;
            fetchList(this.listQuery).then((response) => {
                this.listLoading = false;
                this.list = response.data.list;
                this.total = response.data.total;
            });
        },
        deleteOrder(ids) {
            this.$confirm('确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = new URLSearchParams();
                params.append('ids', ids);
                deleteOrder(params).then((response) => {
                    this.$message({
                        message: '删除成功！',
                        type: 'success',
                        duration: 1000
                    });
                    this.getList();
                });
            });
        },
        covertOrder(order) {
            let address =
                order.receiverProvince + order.receiverCity + order.receiverRegion + order.receiverDetailAddress;
            let listItem = {
                orderId: order.id,
                orderSn: order.orderSn,
                receiverName: order.receiverName,
                receiverPhone: order.receiverPhone,
                receiverPostCode: order.receiverPostCode,
                address: address,
                deliveryCompany: null,
                deliverySn: null
            };
            return listItem;
        }
    }
};
</script>
