<template>
    <div class="app-container">
        <el-page-header @back="onBack">
            <template #icon>
                <el-icon><ElIconArrowLeft /></el-icon>
            </template>
            <template #content>
                <span class="text-large font-600 mr-3">秒杀时间段选择</span>
            </template>
        </el-page-header>

        <div class="table-container">
            <el-table ref="selectSessionTable" :data="list" style="width: 100%" v-loading="listLoading" border>
                <el-table-column label="编号" width="100">
                    <template v-slot="scope">{{ scope.row.id }}</template>
                </el-table-column>
                <el-table-column label="秒杀时间段名称">
                    <template v-slot="scope">{{ scope.row.name }}</template>
                </el-table-column>
                <el-table-column label="每日开始时间">
                    <template v-slot="scope">{{ formatTime_filter(scope.row.startTime) }}</template>
                </el-table-column>
                <el-table-column label="每日结束时间">
                    <template v-slot="scope">{{ formatTime_filter(scope.row.endTime) }}</template>
                </el-table-column>
                <el-table-column label="商品数量">
                    <template v-slot="scope">{{ scope.row.productCount }}</template>
                </el-table-column>
                <el-table-column label="操作" fixed="right">
                    <template v-slot="scope">
                        <el-button link type="primary" @click="handleShowRelation(scope.$index, scope.row)"
                            >商品列表
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import { fetchSelectList } from '@/api/flashSession';
import { formatDate } from '@/utils/date';
export default {
    name: 'selectSessionList',
    data() {
        return {
            list: null,
            listLoading: false
        };
    },
    created() {
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
            return formatDate(date, 'hh:mm:ss');
        },
        handleShowRelation(index, row) {
            this.$router.push({
                path: '/sms/flash/flashProductRelation',
                query: {
                    flashPromotionId: this.$route.query.flashPromotionId,
                    flashPromotionSessionId: row.id
                }
            });
        },
        getList() {
            this.listLoading = true;
            fetchSelectList({
                flashPromotionId: this.$route.query.flashPromotionId
            }).then((response) => {
                this.listLoading = false;
                this.list = response.data;
            });
        }
    }
};
</script>
