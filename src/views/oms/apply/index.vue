<template>
    <div>
        <div class="app-container" v-if="$route.matched.length <= 2">
            <el-card class="filter-container" shadow="never">
                <el-form :inline="true" :model="listQuery" label-width="90px">
                    <el-row :gutter="10">
                        <el-col :span="8">
                            <el-form-item label="输入搜索：">
                                <el-input v-model="listQuery.id" class="input-width" placeholder="服务单号"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="处理状态：">
                                <el-select v-model="listQuery.status" placeholder="全部" clearable class="input-width">
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
                            <el-form-item label="申请时间：">
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
                            <el-form-item label="操作人员：">
                                <el-input
                                    v-model="listQuery.handleMan"
                                    class="input-width"
                                    placeholder="全部"
                                ></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="处理时间：">
                                <el-date-picker
                                    class="input-width"
                                    v-model="listQuery.handleTime"
                                    value-format="yyyy-MM-dd"
                                    type="date"
                                    placeholder="请选择时间"
                                >
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8"
                            ><div class="filter-operation">
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
                    ref="returnApplyTable"
                    :data="list"
                    style="width: 100%"
                    @selection-change="handleSelectionChange"
                    v-loading="listLoading"
                    border
                >
                    <el-table-column type="selection" width="60"></el-table-column>
                    <el-table-column label="服务单号" width="180">
                        <template v-slot="scope">{{ scope.row.id }}</template>
                    </el-table-column>
                    <el-table-column label="申请时间" width="180">
                        <template v-slot="scope">{{ formatTime_filter(scope.row.createTime) }}</template>
                    </el-table-column>
                    <el-table-column label="用户账号" width="120">
                        <template v-slot="scope">{{ scope.row.memberUsername }}</template>
                    </el-table-column>
                    <el-table-column label="退款金额" width="180">
                        <template v-slot="scope">￥{{ formatReturnAmount_filter(scope.row) }}</template>
                    </el-table-column>
                    <el-table-column label="申请状态" width="180">
                        <template v-slot="scope">{{ formatStatus_filter(scope.row.status) }}</template>
                    </el-table-column>
                    <el-table-column label="处理时间" width="180">
                        <template v-slot="scope">{{ formatTime_filter(scope.row.handleTime) }}</template>
                    </el-table-column>
                    <el-table-column label="操作" width="120" fixed="right">
                        <template v-slot="scope">
                            <el-button link type="primary" @click="handleViewDetail(scope.$index, scope.row)"
                                >查看详情</el-button
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
import { formatDate } from '@/utils/date';
import { fetchList, deleteApply } from '@/api/returnApply';
const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    id: null,
    receiverKeyword: null,
    status: null,
    createTime: null,
    handleMan: null,
    handleTime: null
};
const defaultStatusOptions = [
    {
        label: '待处理',
        value: 0
    },
    {
        label: '退货中',
        value: 1
    },
    {
        label: '已完成',
        value: 2
    },
    {
        label: '已拒绝',
        value: 3
    }
];
export default {
    name: 'returnApplyList',
    data() {
        return {
            listQuery: Object.assign({}, defaultListQuery),
            statusOptions: Object.assign({}, defaultStatusOptions),
            list: null,
            total: null,
            listLoading: false,
            multipleSelection: [],
            operateType: 1,
            operateOptions: [
                {
                    label: '批量删除',
                    value: 1
                }
            ]
        };
    },
    created() {
        this.getList();
    },
    methods: {
        formatReturnAmount_filter(row) {
            return row.productRealPrice * row.productCount;
        },
        formatStatus_filter(status) {
            for (let i = 0; i < defaultStatusOptions.length; i++) {
                if (status === defaultStatusOptions[i].value) {
                    return defaultStatusOptions[i].label;
                }
            }
        },
        formatTime_filter(time) {
            if (time == null || time === '') {
                return '--';
            }
            let date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleResetSearch() {
            this.listQuery = Object.assign({}, defaultListQuery);
        },
        handleSearchList() {
            this.listQuery.pageNum = 1;
            this.getList();
        },
        handleViewDetail(index, row) {
            this.$router.push({
                path: '/oms/returnApply/returnApplyDetail',
                query: { id: row.id }
            });
        },
        handleBatchOperate() {
            if (this.multipleSelection == null || this.multipleSelection.length < 1) {
                this.$message({
                    message: '请选择要操作的申请',
                    type: 'warning',
                    duration: 1000
                });
                return;
            }
            if (this.operateType === 1) {
                //批量删除
                this.$confirm('是否要进行删除操作?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let params = new URLSearchParams();
                    let ids = [];
                    for (let i = 0; i < this.multipleSelection.length; i++) {
                        ids.push(this.multipleSelection[i].id);
                    }
                    params.append('ids', ids);
                    deleteApply(params).then((response) => {
                        this.getList();
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    });
                });
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
