/*
<form-picker v-model="aaaa" :columns="[{text:'aaa',value:1},{text:'bbb',value:2}]" placeholder="请选择查勘机构"></form-picker>
    


*/

// form-picker
Vue.component('form-picker', {
    template: `
                <div class="form-item_rig">
                    <input :type="type" class="value" v-model="newValue.text" :class="isHasBg&&'input-bg'" :placeholder="placeholder" readonly @click="openPicker">
                    <vant-picker v-model="showPicker" :title="title" :columns="columns" :column.sync="newValue"></vant-picker>  
                </div>
            `,
    props: {
        columns: {
            type: Array
        },
        value: {
            required: true
        },
        title: {},
        type: {
            default: 'text'
        },
        placeholder: {},

        isHasBg: {
            default: false
        }
    },
    data() {
        return {
            showPicker: false,
            newValue: {}
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
    methods: {
        openPicker: function() {
            this.showPicker = true
        }
    }
})