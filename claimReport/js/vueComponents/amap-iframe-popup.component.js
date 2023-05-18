Vue.component('amap-iframe-popup', {
    template: ` 
    <van-popup v-model="newValue" position="bottom" :lazy-render="false">
        <div class="close-map" @click="newValue = false"></div>
        <iframe ref="mapIframe" src="//m.amap.com/picker/?keywords=写字楼,小区,学校&zoom=15&center=116.470098,39.992838&radius=1000&total=20&key=0e0515e5982fbfb4bb949348fe907b16" frameborder="0" style="width: 100%;height: 100vh;"></iframe>
    </van-popup>
	`,
    props: {
        value: {
            type: Boolean
        }
    },
    data() {
        return {
            newValue: false
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
    mounted() {
        var that = this;
        this.$nextTick(function() {
            that.initMap()
        })
    },
    methods: {
        // 初始化地图选址
        initMap: function() {
            var iframe = this.$refs['mapIframe'],
                that = this;
            iframe.onload = function() {
                iframe.contentWindow.postMessage('hello', 'https://m.amap.com/picker/');
            };
            window.addEventListener("message", function(e) {
                if (e.data.name) {
                    that.$emit('message', e) // 返回事件
                }
                that.newValue = false
            }, false);
        }
    }
})