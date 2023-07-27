<template>
    <div>
        <div class="app-container" v-if="$route.matched.length <= 2">
            <el-card class="filter-container" shadow="never">
                <div>
                    <el-form :inline="true" :model="listQuery" label-width="140px">
                        <el-row :gutter="10">
                            <el-col :span="8">
                                <el-form-item label="活动名称：">
                                    <el-input
                                        v-model="listQuery.keyword"
                                        class="input-width"
                                        placeholder="活动名称"
                                        clearable
                                    ></el-input>
                                </el-form-item>
                            </el-col>

                            <el-col :span="16">
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

            <el-card class="operate-container" shadow="never">
                <el-button type="primary" class="btn-add" @click="handleAdd()">添加活动</el-button>
                <el-button type="primary" class="btn-add" @click="handleShowSessionList()"> 秒杀时间段列表 </el-button>
            </el-card>

            <div class="table-container">
                <el-table ref="flashTable" :data="list" style="width: 100%" v-loading="listLoading" border>
                    <el-table-column type="selection" width="60"></el-table-column>
                    <el-table-column label="编号" width="100">
                        <template v-slot="scope">{{ scope.row.id }}</template>
                    </el-table-column>
                    <el-table-column label="活动标题" width="140">
                        <template v-slot="scope">{{ scope.row.title }}</template>
                    </el-table-column>
                    <el-table-column label="活动状态" width="140">
                        <template v-slot="scope">{{ formatActiveStatus_filter(scope.row) }}</template>
                    </el-table-column>
                    <el-table-column label="开始时间" width="140">
                        <template v-slot="scope">{{ formatDate_filter(scope.row.startDate) }}</template>
                    </el-table-column>
                    <el-table-column label="结束时间" width="140">
                        <template v-slot="scope">{{ formatDate_filter(scope.row.endDate) }}</template>
                    </el-table-column>
                    <el-table-column label="上线/下线" width="200">
                        <template v-slot="scope">
                            <el-switch
                                @change="handleStatusChange(scope.$index, scope.row)"
                                :active-value="1"
                                :inactive-value="0"
                                v-model="scope.row.status"
                            >
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="180" fixed="right">
                        <template v-slot="scope">
                            <el-button link type="primary" @click="handleSelectSession(scope.$index, scope.row)"
                                >设置商品
                            </el-button>
                            <el-button link type="primary" @click="handleUpdate(scope.$index, scope.row)">
                                编辑
                            </el-button>
                            <el-button link type="danger" @click="handleDelete(scope.$index, scope.row)"
                                >删除
                            </el-button>
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

            <el-dialog title="添加活动" v-model="dialogVisible" width="660px">
                <el-form :model="flashPromotion" ref="flashPromotionForm" label-width="90px">
                    <el-form-item label="活动标题：">
                        <el-input v-model="flashPromotion.title" class="input-width"></el-input>
                    </el-form-item>
                    <el-form-item label="开始时间：">
                        <el-date-picker
                            v-model="flashPromotion.startDate"
                            type="date"
                            placeholder="请选择时间"
                            class="input-width"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间：">
                        <el-date-picker
                            v-model="flashPromotion.endDate"
                            type="date"
                            placeholder="请选择时间"
                            class="input-width"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="上线/下线">
                        <el-radio-group v-model="flashPromotion.status">
                            <el-radio :label="1">上线</el-radio>
                            <el-radio :label="0">下线</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
                <template v-slot:footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="handleDialogConfirm()">确定</el-button>
                    </span>
                </template>
            </el-dialog>
        </div>

        <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
                <component :is="Component"></component>
            </transition>
        </router-view>
    </div>
</template>

<script>
import { fetchList, updateStatus, deleteFlash, createFlash, updateFlash } from '@/api/flash';
import { formatDate } from '@/utils/date';

const defaultListQuery = {
    pageNum: 1,
    pageSize: 10,
    keyword: null
};
const defaultFlashPromotion = {
    id: null,
    title: null,
    startDate: null,
    endDate: null,
    status: 0
};
export default {
    name: 'flashPromotionList',
    data() {
        return {
            listQuery: Object.assign({}, defaultListQuery),
            list: null,
            total: null,
            listLoading: false,
            dialogVisible: false,
            flashPromotion: Object.assign({}, defaultFlashPromotion),
            isEdit: false
        };
    },
    created() {
        this.getList();
    },
    methods: {
        formatDate_filter(time) {
            if (time == null || time === '') {
                return '--';
            }
            let date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd');
        },
        formatActiveStatus_filter(row) {
            let nowTime = new Date().getTime();
            if (nowTime >= row.startDate && nowTime <= row.endDate) {
                return '活动进行中';
            } else if (nowTime > row.endDate) {
                return '活动已结束';
            } else {
                return '活动未开始';
            }
        },
        handleResetSearch() {
            this.listQuery = Object.assign({}, defaultListQuery);
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
        },
        handleAdd() {
            this.dialogVisible = true;
            this.isEdit = false;
            this.flashPromotion = Object.assign({}, defaultFlashPromotion);
        },
        handleShowSessionList() {
            this.$router.push({ path: '/sms/flash/flashSession' });
        },
        handleStatusChange(index, row) {
            this.$confirm('是否要修改该状态?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    updateStatus(row.id, { status: row.status }).then((response) => {
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                    });
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '取消修改'
                    });
                    this.getList();
                });
        },
        handleDelete(index, row) {
            this.$confirm('确定要删除该活动吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteFlash(row.id).then((response) => {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getList();
                });
            });
        },
        handleUpdate(index, row) {
            this.dialogVisible = true;
            this.isEdit = true;
            this.flashPromotion = Object.assign({}, row);
        },
        handleDialogConfirm() {
            this.$confirm('是否要确认?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if (this.isEdit) {
                    updateFlash(this.flashPromotion.id, this.flashPromotion).then((response) => {
                        this.$message({
                            message: '修改成功！',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.getList();
                    });
                } else {
                    createFlash(this.flashPromotion).then((response) => {
                        this.$message({
                            message: '添加成功！',
                            type: 'success'
                        });
                        this.dialogVisible = false;
                        this.getList();
                    });
                }
            });
        },
        handleSelectSession(index, row) {
            this.$router.push({
                path: '/sms/flash/selectSession',
                query: { flashPromotionId: row.id }
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
