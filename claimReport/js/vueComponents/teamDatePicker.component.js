/*
<form-date-picker v-model="aaaa"  placeholder="请选择时间"></form-date-picker>
 


*/
// team-date-picker
Vue.component('team-date-picker', {
    template: `
                <div>
                    <input :type="type" v-model="dateCH" :placeholder="placeholder" readonly @click="openPicker">
                    <vant-date-picker v-model="showPicker" :title="title" :currentdate.sync="newValue" type="year-month"></vant-date-picker>
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
    },
    data() {
        return {
            datetype:'yyyy-MM',
            dateFormat: '',
            showPicker: false,
            newValue: null
        }
    },
    computed: {
        dateCH: function () {
            return formatDate(this.newValue, this.datetype,'true')
        }
    },
    watch: {
        value() {
            this.newValue = this.value
        },
        newValue() {
            this.$emit('input', this.newValue)
            this.$emit('onchange', this.newValue)
        }
    },
    created() {
        this.newValue = this.value
    },
    methods: {
        openPicker: function () {
            this.showPicker = true
        }
    }
})