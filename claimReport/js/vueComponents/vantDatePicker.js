/*
doc:https://vant-contrib.gitee.io/vant/#/zh-CN/datetime-picker

<vant-date-picker v-model="showPicker" :currentdate.sync="currentDate" type="year-month"></vant-date-picker>




type date time year-month month-day datehour
*/


Vue.component('vant-date-picker', {
    template: `
	<van-popup v-model="newValue" position="bottom">
		  <van-datetime-picker
		  v-model="bindDate"
			:type="type"
			:title="title"
			:min-date="mindate"
			:max-date="maxdate"
			:filter="filter"
			:formatter="formatter"
			@confirm="onConfirm"
		  >
	  </van-datetime-picker>
	</van-popup>
	`,
    props: {
        // 弹窗开关
        value: {
            required: true
        },
        // 时间选择控件类型 date time year-month month-day datehour
        type: {
            required: true
        },
        // 弹窗头部的title
        title: {
            default: '请选择'
        },
        mindate: {
            default: new Date(2020, 0, 1)
        },
        maxdate: {
            default: new Date(2025, 11, 1)
        },
        // 传入的默认时间 (格林威治时间)
        currentdate: {
            default: new Date()
        }
    },
    watch: {
        value() {
            this.newValue = this.value
        },
        newValue() {
            this.$emit('input', this.newValue)
        },
        copyCurrentDate() {
            this.$emit('update:currentdate', this.copyCurrentDate)
        },
    },
    data() {
        return {
            bindDate: null,
            newValue: false,
            copyCurrentDate: ''
        }
    },
    created() {
        this.bindDate = this.currentdate
        this.newValue = this.value
    },
    methods: {
        filter(type, options) {
            // if (type === 'minute') {
            //     return options.filter((option) => option % 5 === 0);
            // }
            return options;
        },
        formatter(type, val) {
            if (type === 'year') {
                return `${val}年`;
            } else if (type === 'month') {
                return `${val}月`;
            } else if (type === 'day') {
                return `${val}日`;
            } else if (type === 'hour') {
                return `${val}时`;
            } else if (type === 'minute') {
                return `${val}分`;
            }
            return val;
        },
        onConfirm(e) {
            var that = this;
            this.copyCurrentDate = this.bindDate
            setTimeout(function() {
                that.$emit('onconfirm', e)
            }, 10)
            this.newValue = false
        }
    }
})