Vue.component('form-upload', {
    template: `
                <div class="form-upload">
                    <div class="form-upload-title" v-if="title">{{title}}</div>
                    <ul class="form-upload-group">
                        <template v-for="(item,key) in uploadList">
                        <li :key="key">
                            <div class="form-upload-item">
                                <img :src="item.url||item.local" />
                                <template v-if="!onlyShow">
                                    <div class="upload-layer-container" v-if="item.loading||item.error">
                                        <div class="upload-layer" v-if="item.error">{{item.errorMsg}}</div>
                                        <div class="upload-layer" v-else>已上传{{item.percent}}%</div>
                                    </div>
                                    <div class="upload-close-icon" @click="delImg(key)"></div>
                                </template>
                            </div>
                        </li>
                        </template>
                        <template v-if="!onlyShow">
                            <li v-if="max > uploadList.length">
                                <div class="form-upload-add" @click="triggerUpload">
                                    <img src="../../img/add-pic.jpg" />
                                </div>
                            </li>
                        </template>
                    </ul>
                </div>
            `,
    props: {
        // 标题
        title: {
            default: ''
        },
        // 是否多图上传
        multiple: {
            default: true
        },
        // 是否仅展示
        onlyShow: {
            default: false
        },
        // 最大数量
        max: {
            default: 4
        },
        // 默认值(一维数组)
        value: {
            type: Array,
            required: true
        }
    },
    data() {
        return {
            uploadFormDOM: null, // 缓存中的formDOM
            cssId: 'form', // css样式的id
            uploadList: [], // 图片数组
            uploadLoading: false, // 上传时的加载状态
            uploadDisabled: false // 上传禁用
        }
    },
    watch: {
        uploadList() {
            this.$emit('input', this.uploadList)
        }
    },
    created() {
        this.initDefault() //初始化传入的value的值
        this.initCss()
    },
    mounted() {
        this.$nextTick(_ => {
            this.initUpload()
        })
    },
    methods: {
        initDefault: function() {
            var defaultFiles = this.value;
            if (defaultFiles.length > 0) {
                if (defaultFiles[0].hasOwnProperty('url')) {
                    this.uploadList = this.value;
                } else if (typeof defaultFiles[0] === 'string') {
                    for (var i = 0; i < defaultFiles.length; i++) {
                        that.uploadList.push({
                            fileUuid: '', // 图片uuid
                            url: defaultFiles[i], // 线上链接
                            local: '', // 本地缓存图片
                            loading: true, // 加载蒙版层
                            error: false, // 是否错误
                            errorMsg: '', // 错误信息
                            percent: 0 // 上传进度
                        })
                    }
                }
            }
        },
        delImg: function(k) {
            this.uploadList.splice(k, 1)
            if (this.uploadList < this.max) {
                this.uploadDisabled = false
            }
        },
        triggerUpload: function() {
            this.uploadFormDOM.children[0].click()
        },
        _applyUpload: function(file) {
            var that = this;
            return new Promise(function(resolve, reject) {
                var lastKey = that.uploadList.length - 1;
                ajax.uploadImg(file, function(e) {
                    // 上传图片返回的进度百分比(正整数)
                    that.uploadList[lastKey].percent = e;
                }).then(function(res) {
                    if (res.data.code === '0') {
                        var result = res.data.data
                        that.uploadList[lastKey].url = result.imgUrl
                        that.uploadList[lastKey].fileUuid = result.fileUuid
                    } else {
                        that.uploadList[lastKey].error = true
                        that.uploadList[lastKey].errorMsg = '上传失败'
                    }
                    that.uploadList[lastKey].loading = false
                    resolve()
                }).catch(function() {
                    that.uploadList[lastKey].errorMsg = '上传错误'
                    that.uploadList[lastKey].error = true
                    that.uploadList[lastKey].loading = false
                    resolve()
                })
            })
        },
        initUpload: function() {
            var formDOM = document.createElement('form');
            var fileDOM = document.createElement('input');
            var that = this;
            fileDOM.setAttribute('type', 'file');
            fileDOM.setAttribute('multiple', this.multiple);
            formDOM.appendChild(fileDOM);
            this.uploadFormDOM = formDOM;
            fileDOM.addEventListener('change', async function(e) {
                var files = e.target.files;
                var file = null;
                var showMsgOnce = true; // for循环中显示错误信息的状态
                if (files.length === 0) return;
                if (that.uploadDisabled) {
                    vant.Toast(`最多可上传${that.max}张图片！`);
                    return;
                }
                for (var i = 0; i < files.length; i++) {

                    if (!that.uploadDisabled) {
                        // 上传到最大值的最后一个时禁用上传功能
                        if ((that.uploadList.length + i) === (that.max - 1)) {
                            that.uploadDisabled = true
                        }
                        file = files[i];
                        that.uploadList.push({
                            fileUuid: '', // 图片uuid
                            url: '', // 线上链接
                            local: URL.createObjectURL(file), // 本地缓存图片
                            loading: true, // 加载蒙版层
                            error: false, // 是否错误
                            errorMsg: '', // 错误信息
                            percent: 0 // 上传进度
                        })
                        await that._applyUpload(file); // 异步上传图片
                    } else {
                        showMsgOnce && vant.Toast(`最多可上传${that.max}张图片！`);
                        showMsgOnce = false;
                    }
                }
                // that.uploadFormDOM.reset() // for循环完毕后清空form数据
            })
        },
        // 初始化css
        initCss: function() {
            var cssStyle = ".form-upload{flex-direction:column;}.form-upload-title{margin:0.12rem 0;width:100%;}.form-upload-group{font-size:0;width:100%;}.form-upload:before{left:0 !important;right:0 !important;}.form-upload-group>li{width:calc((100% - (0.24rem * 3)) / 4);display:inline-block;margin-bottom:0.24rem;margin-right:0.24rem;}.form-upload-group>li:nth-child(4n){margin-right:0;}.form-upload-group .form-upload-add{border:1px dashed #e8e8e8;}.form-upload-group .form-upload-add,.form-upload-group .form-upload-item{background-color:#f8f9fb;width:100%;height:1.2rem;border-radius:0.08rem;position:relative;box-sizing:border-box;}.form-upload-group .form-upload-add>img,.form-upload-group .form-upload-item>img{border-radius:inherit;width:100%;height:100%;object-fit:contain;object-position:initial;}.form-upload .upload-layer{position:absolute;top:0;left:0;width:100%;height:100%;background-color:rgba(0,0,0,0.7);border-radius:inherit;display:flex;align-items:center;justify-content:center;font-size:0.24rem;color:#fff;}.form-upload .upload-close-icon::after{content:'x';}.form-upload .upload-close-icon{position:absolute;top:-0.16rem;right:-0.16rem;width:0.44rem;height:0.44rem;background:url(../../img/close.png) #fff center center/cover no-repeat;border-radius:50%;}.upload-form{position:absolute;top:-19999.98rem;right:-1999.98rem;opacity:0;}";
            var styleTag = document.getElementById(this.cssId);
            // 防止css多次重复被插入
            if (!styleTag) {
                styleTag = document.createElement('style');
                styleTag.id = this.cssId;
                styleTag.innerHTML = cssStyle;
                document.head.appendChild(styleTag);
            }
        }
    }
})


/*


        .form-upload {
            flex-direction: column;
        }
        
        .form-upload-title {
            margin: 6px 0;
            width: 100%;
        }
        
        .form-upload-group {
            font-size: 0;
            width: 100%;
        }
        
        .form-upload:before {
            left: 0 !important;
            right: 0 !important;
        }
        
        .form-upload-group>li {
            width: calc((100% - (12px * 3)) / 4);
            display: inline-block;
            margin-bottom: 12px;
            margin-right: 12px;
        }
        
        .form-upload-group>li:nth-child(4n) {
            margin-right: 0;
        }
        
        .form-upload-group .form-upload-add {
            border: 1px dashed #e8e8e8;
        }
        
        .form-upload-group .form-upload-add,
        .form-upload-group .form-upload-item {
            background-color: #f8f9fb;
            width: 100%;
            height: 60px;
            border-radius: 4px;
            position: relative;
            box-sizing: border-box;
        }
        
        .form-upload-group .form-upload-add>img,
        .form-upload-group .form-upload-item>img {
            border-radius: inherit;
            width: 100%;
            height: 100%;
            object-fit: contain;
            object-position: initial;
        }
        
        .form-upload .upload-layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            border-radius: inherit;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            color: #fff;
        }
        
        .form-upload .upload-close-icon::after {
            content: 'x';
        }
        
        .form-upload .upload-close-icon {
            position: absolute;
            top: -8px;
            right: -8px;
            width: 22px;
            height: 22px;
            background: url(../../img/close.png) #fff center center/cover no-repeat;
            border-radius: 50%;
        }
        
        .upload-form {
            position: absolute;
            top: -999999px;
            right: -99999px;
            opacity: 0;
        }
*/