/*
doc:https://vant-contrib.gitee.io/vant/#/zh-CN/datetime-picker

<vant-picker v-model="showPicker" :columns="columns" :column.sync="newValue"></vant-picker>




type date time year-month month-day datehour
*/


Vue.component('vant-picker', {
    template: `
	<van-popup v-model="newValue" position="bottom">
		  <van-picker
		    :title="title"
			:value-key="valuekey"
		    show-toolbar
		    :columns="columns"
            @cancel="onCancel"
		    @confirm="onConfirm"
		  ></van-picker>
	</van-popup>
	`,
    props: {
        // 弹窗开关
        value: {
            required: true
        },
        // 	选项对象中，选项文字对应的键名
        valuekey: {
            default: 'text'
        },
        // 弹窗头部的title
        title: {
            default: '请选择'
        },
        // 传入的默认时间 (格林威治时间)
        columns: {
            type: Array,
            required: true
        },
        // 绑定的对象
        column: {}
    },
    watch: {
        value() {
            this.newValue = this.value
        },
        newValue() {
            this.$emit('input', this.newValue)
        },
        copyColumn() {
            this.$emit('update:column', this.copyColumn)
        },
    },
    data() {
        return {
            newValue: false,
            copyColumn: {}
        }
    },
    created() {
        this.copyColumn = this.column
        this.newValue = this.value
    },
    methods: {
        onCancel: function () {
            this.newValue = false
        },
        onConfirm(e) {
            var that = this;
            this.copyColumn = e
            setTimeout(function () {
                that.$emit('onconfirm', e)
            }, 10)
            this.newValue = false
        }
    }
})