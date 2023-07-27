<template>
    <div>
        <div class="app-container" v-if="$route.matched.length <= 2">
            <el-card class="filter-container" shadow="never">
                <el-form :inline="true" :model="listQuery" label-width="100px">
                    <el-row :gutter="10">
                        <el-col :span="8">
                            <el-form-item label="优惠券名称：">
                                <el-input
                                    v-model="listQuery.name"
                                    class="input-width"
                                    placeholder="优惠券名称"
                                ></el-input>
                            </el-form-item>
                        </el-col>

                        <el-col :span="8">
                            <el-form-item label="优惠券类型：">
                                <el-select v-model="listQuery.type" placeholder="全部" clearable class="input-width">
                                    <el-option
                                        v-for="item in typeOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
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
            </el-card>

            <el-card class="operate-container" shadow="never">
                <el-button type="primary" class="btn-add" @click="handleAdd()">添加</el-button>
            </el-card>

            <div class="table-container">
                <el-table
                    ref="couponTable"
                    :data="list"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    v-loading="listLoading"
                    border
                >
                    <el-table-column type="selection" width="60"></el-table-column>
                    <el-table-column label="编号" width="100">
                        <template v-slot="scope">{{ scope.row.id }}</template>
                    </el-table-column>
                    <el-table-column label="优惠劵名称" width="160">
                        <template v-slot="scope">{{ scope.row.name }}</template>
                    </el-table-column>
                    <el-table-column label="优惠券类型" width="100">
                        <template v-slot="scope">{{ formatType_filter(scope.row.type) }}</template>
                    </el-table-column>
                    <el-table-column label="可使用商品" width="100">
                        <template v-slot="scope">{{ formatUseType_filter(scope.row.useType) }}</template>
                    </el-table-column>
                    <el-table-column label="使用门槛" width="140">
                        <template v-slot="scope">满{{ scope.row.minPoint }}元可用</template>
                    </el-table-column>
                    <el-table-column label="面值" width="100">
                        <template v-slot="scope">{{ scope.row.amount }}元</template>
                    </el-table-column>
                    <el-table-column label="适用平台" width="100">
                        <template v-slot="scope">{{ formatPlatform_filter(scope.row.platform) }}</template>
                    </el-table-column>
                    <el-table-column label="有效期" width="180">
                        <template v-slot="scope"
                            >{{ formatDate_filter(scope.row.startTime) }}至{{
                                formatDate_filter(scope.row.endTime)
                            }}</template
                        >
                    </el-table-column>
                    <el-table-column label="状态" width="100">
                        <template v-slot="scope">{{ formatStatus_filter(scope.row.endTime) }}</template>
                    </el-table-column>
                    <el-table-column label="操作" width="180" fixed="right">
                        <template v-slot="scope">
                            <el-button link type="primary" @click="handleView(scope.$index, scope.row)">查看</el-button>
                            <el-button link type="primary" @click="handleUpdate(scope.$index, scope.row)">
                                编辑</el-button
                            >
                            <el-button link type="danger" @click="handleDelete(scope.$index, scope.row)"
                                >删除</el-button
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
        </div>

        <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
                <component :is="Component"></component>
            </transition>
        </router-view>
    </div>
</template>

<script>
import { fetchList, deleteCoupon } from '@/api/coupon';
import { formatDate } from '@/utils/date';
const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    name: null,
    type: null
};
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
export default {
    name: 'couponList',
    data() {
        return {
            listQuery: Object.assign({}, defaultListQuery),
            typeOptions: Object.assign({}, defaultTypeOptions),
            list: null,
            total: null,
            listLoading: false,
            multipleSelection: []
        };
    },
    created() {
        this.getList();
    },
    methods: {
        formatStatus_filter(endTime) {
            let now = new Date().getTime();
            let endDate = new Date(endTime);
            if (endDate > now) {
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
        handleSizeChange(val) {
            this.listQuery.pageNum = 1;
            this.listQuery.pageSize = val;
            this.getList();
        },
        handleCurrentChange(val) {
            this.listQuery.pageNum = val;
            this.getList();
        },
        handleAdd() {
            this.$router.push({ path: '/sms/coupon/addCoupon' });
        },
        handleView(index, row) {
            this.$router.push({ path: '/sms/coupon/couponHistory', query: { id: row.id } });
        },
        handleUpdate(index, row) {
            this.$router.push({ path: '/sms/coupon/updateCoupon', query: { id: row.id } });
        },
        handleDelete(index, row) {
            this.$confirm('确定要删除操吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteCoupon(row.id).then((response) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getList();
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
        }
    }
};
</script>

<style scoped>
.input-width {
    width: 203px;
}
</style>
