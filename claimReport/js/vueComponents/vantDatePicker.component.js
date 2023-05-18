/*
<form-date-picker v-model="aaaa"  placeholder="请选择时间"></form-date-picker>
    


*/



/**
 * @method
 * 格式化时间
 *
 * @param {*} date 格林威治时间
 * @param {string} type
 * 'yyyy-MM-dd h:i:s'
 * 'yyyy-MM-dd h:i'
 * 'yyyy-MM-dd'
 * 'yyyy-MM'
 *
 * use: this.$common.formatDate(new Date().getTime()) 返回日期 2018-06-09
 */
var formatDate = function(date, type, isCH = false) {
    if (!date) return '';
    let a
    if (date !== undefined) {
        a = new Date(date)
    } else {
        a = new Date()
    }
    var yearS = isCH ? '年' : '-',
        monthS = isCH ? '月' : '-',
        dayS = isCH ? '日' : '';
    var y = a.getFullYear()
    var m = a.getMonth() + 1
    m = m < 10 ? '0' + m : m
    var d = a.getDate()
    d = d < 10 ? '0' + d : d
    var h = a.getHours()
    var i = a.getMinutes()
    var s = a.getSeconds()
        // eslint-disable-next-line
    h.toString().length === 1 ? (h = '0' + h) : ''
        // eslint-disable-next-line
    i.toString().length === 1 ? (i = '0' + i) : ''
        // eslint-disable-next-line
    s.toString().length === 1 ? (s = '0' + s) : ''
    var result = ''
    switch (type) {
        case 'yyyy-MM':
            result = y + yearS + m + (isCH ? monthS : '')
            break
        case 'yyyy-MM-dd':
            result = y + yearS + m + monthS + d + dayS
            break
        case 'yyyy-MM-dd h:i':
            result = y + yearS + m + monthS + d + dayS + ' ' + h + ':' + i
            break
        case 'yyyy-MM-dd h:i:s':
            result = y + yearS + m + monthS + d + dayS + ' ' + h + ':' + i + ':' + s
            break
        default:
            result = y + yearS + m + monthS + d + dayS
            break
    }
    return result
}

// form-picker
Vue.component('form-date-picker', {
    template: `
                <div class="form-item_rig">
                    <input :type="type" class="value" v-model="dateCH" :class="ishasbg&&'input-bg'" :placeholder="placeholder" readonly @click="openPicker">
                    <vant-date-picker v-model="showPicker" :title="title" :currentdate.sync="newValue" :type="datetype"></vant-date-picker>
                </div>
            `,
    props: {
        value: {
            required: true
        },
        type: {
            default: 'text'
        },
        title: {},
        placeholder: {},
        datetype: {
            default: 'year-month'
        },
        ishasbg: {
            default: false
        }
    },
    data() {
        return {
            dateFormat: '',
            showPicker: false,
            newValue: null
        }
    },
    computed: {
        dateCH: function() {
            return formatDate(this.newValue, this.datetype)
        }
    },
    watch: {
        value() {
            this.newValue = this.value
        },
        newValue() {
            this.$emit('input', this.newValue)
        }
    },
    created() {
        this.setFormat()
    },
    methods: {
        setFormat: function() {
            var dateType = this.datetype
                // date time year-month month-day datehour
            if (dateType === 'year-month') {
                this.formatDate = 'yyyy-MM'
            } else if (dateType === 'date') {
                this.formatDate = 'yyyy-MM-dd'
            } else if (dateType === 'datetime') {
                this.formatDate = 'yyyy-MM-dd h:i:s'
            } else {
                this.formatDate = 'yyyy-MM-dd h:i:s'
            }
        },
        openPicker: function() {
            this.showPicker = true
        }
    }
})