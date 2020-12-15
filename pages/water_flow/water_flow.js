// pages/water_flow/water_flow.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        data:Object
    },
    
    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        to_info:function(e){
            let data = e.currentTarget.dataset.item;
            let specification_id = data.id;
            let product_id = data.product.id;
            wx.navigateTo({
                url: `/pages/product_info/product_info?specification_id=${specification_id}&product_id=${product_id}`
            });
        },
    }
})
