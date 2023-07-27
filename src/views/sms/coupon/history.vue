<template>
    <div class="app-container">
        <el-page-header @back="onBack">
            <template #icon>
                <el-icon><ElIconArrowLeft /></el-icon>
            </template>
            <template #content>
                <span class="text-large font-600 mr-3">优惠券领取详情</span>
            </template>
        </el-page-header>

        <el-card shadow="never">
            <div class="table-layout">
                <el-row>
                    <el-col :span="4" class="table-cell-title">名称</el-col>
                    <el-col :span="4" class="table-cell-title">优惠券类型</el-col>
                    <el-col :span="4" class="table-cell-title">可使用商品</el-col>
                    <el-col :span="4" class="table-cell-title">使用门槛</el-col>
                    <el-col :span="4" class="table-cell-title">面值</el-col>
                    <el-col :span="4" class="table-cell-title">状态</el-col>
                </el-row>
                <el-row>
                    <el-col :span="4" class="table-cell">{{ coupon.name }}</el-col>
                    <el-col :span="4" class="table-cell">{{ formatType_filter(coupon.type) }}</el-col>
                    <el-col :span="4" class="table-cell">{{ formatUseType_filter(coupon.useType) }}</el-col>
                    <el-col :span="4" class="table-cell">满{{ coupon.minPoint }}元可用</el-col>
                    <el-col :span="4" class="table-cell">{{ coupon.amount }}元</el-col>
                    <el-col :span="4" class="table-cell">{{ formatStatus_filter(coupon.endTime) }}</el-col>
                </el-row>
                <el-row>
                    <el-col :span="4" class="table-cell-title">有效期</el-col>
                    <el-col :span="4" class="table-cell-title">总发行量</el-col>
                    <el-col :span="4" class="table-cell-title">已领取</el-col>
                    <el-col :span="4" class="table-cell-title">待领取</el-col>
                    <el-col :span="4" class="table-cell-title">已使用</el-col>
                    <el-col :span="4" class="table-cell-title">未使用</el-col>
                </el-row>
                <el-row>
                    <el-col :span="4" class="table-cell" style="font-size: 13px">
                        {{ formatDate_filter(coupon.startTime) }}至{{ formatDate_filter(coupon.endTime) }}
                    </el-col>
                    <el-col :span="4" class="table-cell">{{ coupon.publishCount }}</el-col>
                    <el-col :span="4" class="table-cell">{{ coupon.receiveCount }}</el-col>
                    <el-col :span="4" class="table-cell">{{ coupon.publishCount - coupon.receiveCount }}</el-col>
                    <el-col :span="4" class="table-cell">{{ coupon.useCount }}</el-col>
                    <el-col :span="4" class="table-cell">{{ coupon.publishCount - coupon.useCount }}</el-col>
                </el-row>
            </div>
        </el-card>

        <el-card shadow="never">
            <div>
                <el-form :inline="true" :model="listQuery" label-width="90px">
                    <el-row :gutter="10">
                        <el-col :span="8">
                            <el-form-item label="使用状态：">
                                <el-select
                                    v-model="listQuery.useStatus"
                                    placeholder="全部"
                                    clearable
                                    class="input-width"
                                >
                                    <el-option
                                        v-for="item in useTypeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>

                        <el-col :span="8">
                            <el-form-item label="订单编号：">
                                <el-input
                                    v-model="listQuery.orderSn"
                                    class="input-width"
                                    placeholder="订单编号"
                                ></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="8">
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
            </div>
        </el-card>

        <div class="table-container">
            <el-table ref="couponHistoryTable" :data="list" style="width: 100%" v-loading="listLoading" border>
                <el-table-column label="优惠码" width="160">
                    <template v-slot="scope">{{ scope.row.couponCode }}</template>
                </el-table-column>
                <el-table-column label="领取会员" width="140">
                    <template v-slot="scope">{{ scope.row.memberNickname }}</template>
                </el-table-column>
                <el-table-column label="领取方式" width="100">
                    <template v-slot="scope">{{ formatGetType_filter(scope.row.getType) }}</template>
                </el-table-column>
                <el-table-column label="领取时间" width="160">
                    <template v-slot="scope">{{ formatTime_filter(scope.row.createTime) }}</template>
                </el-table-column>
                <el-table-column label="当前状态" width="140">
                    <template v-slot="scope">{{ formatCouponHistoryUseType_filter(scope.row.useStatus) }}</template>
                </el-table-column>
                <el-table-column label="使用时间" width="160">
                    <template v-slot="scope">{{ formatTime_filter(scope.row.useTime) }}</template>
                </el-table-column>
                <el-table-column label="订单编号">
                    <template v-slot="scope">{{ scope.row.orderSn === null ? '--' : scope.row.orderSn }}</template>
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
    </div>
</template>

<script>
import { formatDate } from '@/utils/date';
import { getCoupon } from '@/api/coupon';
import { fetchList as fetchCouponHistoryList } from '@/api/couponHistory';

const defaultTypeOptions = [
    {
        label: '全场赠券',
        value: 0
    },
    {
        label: '会员赠券',
        value: 1
    },
    {
        label: '购物赠券',
        value: 2
    },
    {
        label: '注册赠券',
        value: 3
    }
];
const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    useStatus: null,
    orderSn: null,
    couponId: null
};
const defaultUseTypeOptions = [
    {
        label: '未使用',
        value: 0
    },
    {
        label: '已使用',
        value: 1
    },
    {
        label: '已过期',
        value: 2
    }
];
export default {
    name: 'couponHistoryList',
    data() {
        return {
            coupon: {},
            listQuery: Object.assign({}, defaultListQuery),
            useTypeOptions: Object.assign({}, defaultUseTypeOptions),
            list: null,
            total: null,
            listLoading: false
        };
    },
    created() {
        getCoupon(this.$route.query.id).then((response) => {
            this.coupon = response.data;
        });
        this.listQuery.couponId = this.$route.query.id;
        this.getList();
    },
    methods: {
        onBack() {
            this.$router.back();
        },
        formatTime_filter(time) {
            if (time == null || time === '') {
                return '--';
            }
            let date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
        },
        formatCouponHistoryUseType_filter(useType) {
            if (useType === 0) {
                return '未使用';
            } else if (useType === 1) {
                return '已使用';
            } else {
                return '已过期';
            }
        },
        formatGetType_filter(type) {
            if (type === 1) {
                return '主动获取';
            } else {
                return '后台赠送';
            }
        },
        formatStatus_filter(endTime) {
            let now = new Date().getTime();
            if (endTime > now) {
                return '未过期';
            } else {
                return '已过期';
            }
        },
        formatDate_filter(time) {
            if (time == null || time === '') {
                return '--';
            }
            let date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd');
        },
        formatPlatform_filter(platform) {
            if (platform === 1) {
                return '移动平台';
            } else if (platform === 2) {
                return 'PC平台';
            } else {
                return '全平台';
            }
        },
        formatUseType_filter(useType) {
            if (useType === 0) {
                return '全场通用';
            } else if (useType === 1) {
                return '指定分类';
            } else {
                return '指定商品';
            }
        },
        formatType_filter(type) {
            for (let i = 0; i < defaultTypeOptions.length; i++) {
                if (type === defaultTypeOptions[i].value) {
                    return defaultTypeOptions[i].label;
                }
            }
            return '';
        },
        getList() {
            this.listLoading = true;
            fetchCouponHistoryList(this.listQuery).then((response) => {
                this.listLoading = false;
                this.list = response.data.list;
                this.total = response.data.total;
            });
        },
        handleResetSearch() {
            this.listQuery = Object.assign({}, defaultListQuery);
            this.listQuery.couponId = this.$route.query.id;
        },
        handleSearchList() {
            this.listQuery.pageNum = 1;
            this.getList();
        },
        handleSizeChange(val) {
            this.listQuery.pageNum = 1;
            this.listQuery.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.pageNum = val;
            this.getList();
        }
    }
};
</script>

<style scoped>
.table-layout {
    margin-top: 20px;
    border-left: 1px solid #dcdfe6;
    border-top: 1px solid #dcdfe6;
}

.table-cell {
    height: 60px;
    line-height: 40px;
    border-right: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
    padding: 10px;
    font-size: 14px;
    color: #606266;
    text-align: center;
    overflow: hidden;
}
.table-cell-title {
    border-right: 1px solid #dcdfe6;
    border-bottom: 1px solid #dcdfe6;
    padding: 10px;
    background: #f2f6fc;
    text-align: center;
    font-size: 14px;
    color: #303133;
}
</style>
