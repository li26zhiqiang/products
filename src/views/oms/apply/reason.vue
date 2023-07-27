<template>
    <div class="app-container">
        <el-card class="operate-container" shadow="never">
            <el-button type="primary" @click="handleAdd" class="btn-add">添加</el-button>
            <div class="batch-operate-container">
                <el-select v-model="operateType" placeholder="批量操作">
                    <el-option v-for="item in operateOptions" :key="item.value" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-button style="margin-left: 8px" class="search-button" @click="handleBatchOperate" type="primary">
                    确定
                </el-button>
            </div>
        </el-card>

        <div class="table-container">
            <el-table
                ref="returnReasonTable"
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
                <el-table-column label="原因类型">
                    <template v-slot="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column label="排序" width="100">
                    <template v-slot="scope">{{ scope.row.sort }}</template>
                </el-table-column>
                <el-table-column label="是否可用">
                    <template v-slot="scope">
                        <el-switch
                            v-model="scope.row.status"
                            @change="handleStatusChange(scope.$index, scope.row)"
                            :active-value="1"
                            :inactive-value="0"
                        >
                        </el-switch>
                    </template>
                </el-table-column>
                <el-table-column label="添加时间" width="180">
                    <template v-slot="scope">{{ formatCreateTime_filter(scope.row.createTime) }}</template>
                </el-table-column>
                <el-table-column label="操作" width="160" fixed="right">
                    <template v-slot="scope">
                        <el-button link type="primary" @click="handleUpdate(scope.$index, scope.row)">编辑</el-button>
                        <el-button link type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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

        <el-dialog title="添加退货原因" v-model="dialogVisible" width="660px">
            <el-form :model="returnReason" ref="reasonForm" label-width="90px">
                <el-form-item label="原因类型：">
                    <el-input v-model="returnReason.name" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="排序：">
                    <el-input v-model="returnReason.sort" class="input-width"></el-input>
                </el-form-item>
                <el-form-item label="是否启用：">
                    <el-switch v-model="returnReason.status" :active-value="1" :inactive-value="0"></el-switch>
                </el-form-item>
            </el-form>
            <template v-slot:footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="handleConfirm">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { formatDate } from '@/utils/date';
import { fetchList, deleteReason, updateStatus, addReason, getReasonDetail, updateReason } from '@/api/returnReason';
const defaultListQuery = {
    pageNum: 1,
    pageSize: 10
};
const defaultReturnReason = {
    name: null,
    sort: 0,
    status: 1,
    createTime: null
};
export default {
    name: 'returnReasonList',
    data() {
        return {
            list: null,
            total: null,
            multipleSelection: [],
            listLoading: true,
            listQuery: Object.assign({}, defaultListQuery),
            operateType: null,
            operateOptions: [
                {
                    label: '删除',
                    value: 1
                }
            ],
            dialogVisible: false,
            returnReason: Object.assign({}, defaultReturnReason),
            operateReasonId: null
        };
    },
    created() {
        this.getList();
    },
    methods: {
        formatCreateTime_filter(time) {
            let date = new Date(time);
            return formatDate(date, 'yyyy-MM-dd hh:mm:ss');
        },
        handleAdd() {
            this.dialogVisible = true;
            this.operateReasonId = null;
            this.returnReason = Object.assign({}, defaultReturnReason);
        },
        handleConfirm() {
            if (this.operateReasonId == null) {
                //添加操作
                addReason(this.returnReason).then((response) => {
                    this.dialogVisible = false;
                    this.operateReasonId = null;
                    this.$message({
                        message: '添加成功！',
                        type: 'success',
                        duration: 1000
                    });
                    this.getList();
                });
            } else {
                //编辑操作
                updateReason(this.operateReasonId, this.returnReason).then((response) => {
                    this.dialogVisible = false;
                    this.operateReasonId = null;
                    this.$message({
                        message: '修改成功！',
                        type: 'success',
                        duration: 1000
                    });
                    this.getList();
                });
            }
        },
        handleUpdate(index, row) {
            this.dialogVisible = true;
            this.operateReasonId = row.id;
            getReasonDetail(row.id).then((response) => {
                this.returnReason = response.data;
            });
        },
        handleDelete(index, row) {
            let ids = [];
            ids.push(row.id);
            this.deleteReason(ids);
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        handleStatusChange(index, row) {
            let ids = [];
            ids.push(row.id);
            let param = new URLSearchParams();
            param.append('status', row.status);
            param.append('ids', ids);
            updateStatus(param).then((response) => {
                this.$message({
                    message: '状态修改成功',
                    type: 'success'
                });
            });
        },
        handleBatchOperate() {
            if (this.multipleSelection == null || this.multipleSelection.length < 1) {
                this.$message({
                    message: '请选择要操作的条目',
                    type: 'warning',
                    duration: 1000
                });
                return;
            }
            if (this.operateType === 1) {
                let ids = [];
                for (let i = 0; i < this.multipleSelection.length; i++) {
                    ids.push(this.multipleSelection[i].id);
                }
                this.deleteReason(ids);
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
        },
        deleteReason(ids) {
            this.$confirm('确定要删除吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let params = new URLSearchParams();
                params.append('ids', ids);
                deleteReason(params).then((response) => {
                    this.$message({
                        message: '删除成功！',
                        type: 'success',
                        duration: 1000
                    });
                    this.listQuery.pageNum = 1;
                    this.getList();
                });
            });
        }
    }
};
</script>

<style scoped>
.input-width {
    width: 80%;
}
</style>
