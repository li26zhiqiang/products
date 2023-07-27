import { createRouter, createWebHashHistory } from 'vue-router';

/* Layout */
import Layout from '../views/layout/Layout';

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
    { path: '/', redirect: '/pms' },
    {
        path: '/404',
        component: () => import('@/views/404'),
        hidden: true
    }
];

export const asyncRouterMap = [
    {
        path: '/pms',
        component: Layout,
        redirect: '/pms/product',
        name: 'pms',
        meta: { title: '商品', icon: 'product' },
        children: [
            {
                path: 'product',
                name: 'product',
                component: () => import('@/views/pms/product/index.vue'),
                meta: { title: '商品列表', icon: 'product-list', isLeafNode: true },
                children: [
                    {
                        path: 'updateProduct',
                        name: 'updateProduct',
                        component: () => import('@/views/pms/product/update.vue'),
                        meta: { title: '修改商品', icon: 'product-add' },
                        hidden: true
                    }
                ]
            },
            {
                path: 'addProduct',
                name: 'addProduct',
                component: () => import('@/views/pms/product/add.vue'),
                meta: { title: '添加商品', icon: 'product-add' }
            },

            {
                path: 'productCate',
                name: 'productCate',
                component: () => import('@/views/pms/productCate/index.vue'),
                meta: { title: '商品分类', icon: 'product-cate', isLeafNode: true },
                children: [
                    {
                        path: 'addProductCate',
                        name: 'addProductCate',
                        component: () => import('@/views/pms/productCate/add.vue'),
                        meta: { title: '添加商品分类' },
                        hidden: true
                    },
                    {
                        path: 'updateProductCate',
                        name: 'updateProductCate',
                        component: () => import('@/views/pms/productCate/update.vue'),
                        meta: { title: '修改商品分类' },
                        hidden: true
                    }
                ]
            },

            {
                path: 'productAttr',
                name: 'productAttr',
                component: () => import('@/views/pms/productAttr/index.vue'),
                meta: { title: '商品类型', icon: 'product-attr', isLeafNode: true },
                children: [
                    {
                        path: 'productAttrList',
                        name: 'productAttrList',
                        component: () => import('@/views/pms/productAttr/productAttrList.vue'),
                        meta: { title: '商品属性/参数列表' },
                        hidden: true
                    },
                    {
                        path: 'addProductAttr',
                        name: 'addProductAttr',
                        component: () => import('@/views/pms/productAttr/addProductAttr.vue'),
                        meta: { title: '添加商品/参数属性' },
                        hidden: true
                    },
                    {
                        path: 'updateProductAttr',
                        name: 'updateProductAttr',
                        component: () => import('@/views/pms/productAttr/updateProductAttr.vue'),
                        meta: { title: '修改商品/参数属性' },
                        hidden: true
                    }
                ]
            },

            {
                path: 'brand',
                name: 'brand',
                component: () => import('@/views/pms/brand/index.vue'),
                meta: { title: '品牌管理', icon: 'product-brand', isLeafNode: true },
                children: [
                    {
                        path: 'addBrand',
                        name: 'addBrand',
                        component: () => import('@/views/pms/brand/add.vue'),
                        meta: { title: '添加品牌' },
                        hidden: true
                    },
                    {
                        path: 'updateBrand',
                        name: 'updateBrand',
                        component: () => import('@/views/pms/brand/update.vue'),
                        meta: { title: '编辑品牌' },
                        hidden: true
                    }
                ]
            }
        ]
    },

    {
        path: '/oms',
        component: Layout,
        redirect: '/oms/order',
        name: 'oms',
        meta: { title: '订单', icon: 'order' },
        children: [
            {
                path: 'order',
                name: 'order',
                component: () => import('@/views/oms/order/index.vue'),
                meta: { title: '订单列表', icon: 'product-list', isLeafNode: true },
                children: [
                    {
                        path: 'orderDetail',
                        name: 'orderDetail',
                        component: () => import('@/views/oms/order/orderDetail.vue'),
                        meta: { title: '订单详情' },
                        hidden: true
                    },
                    {
                        path: 'deliverOrderList',
                        name: 'deliverOrderList',
                        component: () => import('@/views/oms/order/deliverOrderList.vue'),
                        meta: { title: '发货列表' },
                        hidden: true
                    }
                ]
            },
            {
                path: 'orderSetting',
                name: 'orderSetting',
                component: () => import('@/views/oms/order/setting.vue'),
                meta: { title: '订单设置', icon: 'order-setting' }
            },
            {
                path: 'returnApply',
                name: 'returnApply',
                component: () => import('@/views/oms/apply/index.vue'),
                meta: { title: '退货申请处理', icon: 'order-return', isLeafNode: true },
                children: [
                    {
                        path: 'returnApplyDetail',
                        name: 'returnApplyDetail',
                        component: () => import('@/views/oms/apply/applyDetail.vue'),
                        meta: { title: '退货原因详情' },
                        hidden: true
                    }
                ]
            },
            {
                path: 'returnReason',
                name: 'returnReason',
                component: () => import('@/views/oms/apply/reason.vue'),
                meta: { title: '退货原因设置', icon: 'order-return-reason' }
            }
        ]
    },
    {
        path: '/sms',
        component: Layout,
        redirect: '/sms/coupon',
        name: 'sms',
        meta: { title: '营销', icon: 'sms' },
        children: [
            {
                path: 'flash',
                name: 'flash',
                component: () => import('@/views/sms/flash/index.vue'),
                meta: { title: '秒杀活动列表', icon: 'sms-flash', isLeafNode: true },
                children: [
                    {
                        path: 'flashSession',
                        name: 'flashSession',
                        component: () => import('@/views/sms/flash/sessionList.vue'),
                        meta: { title: '秒杀时间段列表' },
                        hidden: true
                    },
                    {
                        path: 'selectSession',
                        name: 'selectSession',
                        component: () => import('@/views/sms/flash/selectSessionList.vue'),
                        meta: { title: '秒杀时间段选择' },
                        hidden: true
                    },
                    {
                        path: 'flashProductRelation',
                        name: 'flashProductRelation',
                        component: () => import('@/views/sms/flash/productRelationList.vue'),
                        meta: { title: '秒杀商品列表' },
                        hidden: true
                    }
                ]
            },

            {
                path: 'coupon',
                name: 'coupon',
                component: () => import('@/views/sms/coupon/index.vue'),
                meta: { title: '优惠券列表', icon: 'sms-coupon', isLeafNode: true },
                children: [
                    {
                        path: 'addCoupon',
                        name: 'addCoupon',
                        component: () => import('@/views/sms/coupon/add.vue'),
                        meta: { title: '添加优惠券' },
                        hidden: true
                    },
                    {
                        path: 'updateCoupon',
                        name: 'updateCoupon',
                        component: () => import('@/views/sms/coupon/update.vue'),
                        meta: { title: '修改优惠券' },
                        hidden: true
                    },
                    {
                        path: 'couponHistory',
                        name: 'couponHistory',
                        component: () => import('@/views/sms/coupon/history.vue'),
                        meta: { title: '优惠券领取详情' },
                        hidden: true
                    }
                ]
            },
            {
                path: 'brand',
                name: 'homeBrand',
                component: () => import('@/views/sms/brand/index.vue'),
                meta: { title: '品牌推荐', icon: 'product-brand' }
            },
            {
                path: 'new',
                name: 'homeNew',
                component: () => import('@/views/sms/new/index.vue'),
                meta: { title: '新品推荐', icon: 'sms-new' }
            },
            {
                path: 'hot',
                name: 'homeHot',
                component: () => import('@/views/sms/hot/index.vue'),
                meta: { title: '人气推荐', icon: 'sms-hot' }
            },
            {
                path: 'subject',
                name: 'homeSubject',
                component: () => import('@/views/sms/subject/index.vue'),
                meta: { title: '专题推荐', icon: 'sms-subject' }
            },
            {
                path: 'advertise',
                name: 'homeAdvertise',
                component: () => import('@/views/sms/advertise/index.vue'),
                meta: { title: '广告列表', icon: 'sms-ad', isLeafNode: true },
                children: [
                    {
                        path: 'addAdvertise',
                        name: 'addHomeAdvertise',
                        component: () => import('@/views/sms/advertise/add.vue'),
                        meta: { title: '添加广告' },
                        hidden: true
                    },
                    {
                        path: 'updateAdvertise',
                        name: 'updateHomeAdvertise',
                        component: () => import('@/views/sms/advertise/update.vue'),
                        meta: { title: '编辑广告' },
                        hidden: true
                    }
                ]
            }
        ]
    },
    { path: '/:catchAll(.*)', redirect: '/404', hidden: true }
];

const router = createRouter({
    history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
    routes: constantRouterMap, // mode: 'history', //后端支持可开
    scrollBehavior: () => ({
        top: 0
    })
});

export default router;
