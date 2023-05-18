Vue.component('step', {
    template: `
    <div class="steps">
    <ul class="steps-items" ref="steps-items">
        <template v-for="(item,key) in stepList[steptype]">
            <li class="step" :class="{'active':step > key}" :key="key" ref="step">
                <div class="step-num-con">
                    <div class="step-num">{{key+1}}</div>
                </div>
                <div class="step-title">{{item}}</div>
            </li>
        </template>
    </ul>
</div>
	`,
    props: {
        step: {
            type: Number,
            default: 1
        },
        steptype: {
            default: 0
        }
    },
    data() {
        return {
            stepList: {
                // 报案单管理的步骤列表
                0: [
                    '查勘现场情况',
                    '车辆统筹情况',
                    '影像资料',
                    '本车定损',
                    '三者车定损',
                    '财务定损',
                    '人伤核损',
                    '理算中心'
                ],
                // 理赔报案的步骤列表
                1: [
                    '选择理赔类型',
                    '填写理赔信息',
                    '上传理赔资料'
                ]
            }
        }
    },
    mounted() {
        var that = this;
        this.init()
        window.addEventListener('resize', function() {
            that.init()
        })
    },
    methods: {
        init: function() {
            var that = this;
            this.$nextTick(function() {
                var item = that.$refs['step'][0].offsetWidth;
                var moveKey = that.step - 1
                if (moveKey > 0) {
                    that.$refs['steps-items'].scroll(item * moveKey, 0);
                }
            })
        }
    }
})