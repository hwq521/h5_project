/*
axios请求

使用
ajax.getPolicyRenewalIndexInfo().then(function(res) {
    if (res.data.code === '0') {

    }
}).catch(function(err){
	
})


错误时不弹窗

eg:

noToast:function(){
    return Axios.post('', {}, {
            headers: {
                noToast: 1
            }
        })
}

*/

function getAgentUuid() {
    return '31e636579cda44b3b72ab7b892d8c77c'
}

function getSessionStoreNo() {
    return '1001'
}
window.basePath = 'http://192.168.2.11:80';
// window.basePath = 'https://miniprogramtest.u1pfreely.online';
(function (win) {
    console.log(window.basePath)
    var Axios = axios.create({
        baseURL: window.basePath // 配置请求的域名
    })
    Axios.interceptors.request.use(function (config) {
        // 在发送请求之前做些什么
        console.log(config)
        if (config.data.hasOwnProperty('opeType')) {
            config.headers['content-type'] = 'application/x-www-form-urlencoded';
            config.data = Qs.stringify({
                jsonParam: JSON.stringify(config.data)
            })

        }
        return config;
    }, function (error) {
        // 对请求错误做些什么
        vant.Toast('请求错误');
        return Promise.reject(error);
    });

    // 添加响应拦截器
    Axios.interceptors.response.use(function (response) {
        // 对响应数据做点什么
        if (!response.config.headers.noToast) {
            if (response.data.code !== '0') {
                vant.Toast(response.data.msg)
            }
        }
        return response;
    }, function (error, response) {
        // 对响应错误做点什么
        vant.Toast('网络错误');
        return Promise.reject(error);
    });

    var ajax = {
        // 上传图片
        uploadImg: function (f, g = function () { }) {
            var formData = new FormData();

            formData.append('jsonParam', JSON.stringify({
                "opeType": "uploadOneImg",
                "map": {
                    "storeNo": "1001"
                }
            }));
            formData.append('file', f);

            return Axios({
                url: '/miniprogram/api/call',
                method: 'post',
                data: formData,
                onUploadProgress: function (e) {
                    var percent = Math.floor(e.loaded / e.total * 100);
                    g(percent)
                }
            })
        },
        // --------------------- 续期 ---------------------
        // 续期首页
        getPolicyRenewalIndexInfo: function (data) {
            var param = {
                "map": {
                    ...data,
                    "agentUuid": getAgentUuid(), //必传
                    "storeNo": getSessionStoreNo() //必传
                },
                "opeType": "getPolicyRenewalIndexInfo"
            }
            return Axios.post('/eaddone/api/call', param)
        },
        // 寿险续期列表页
        searchLifePolicyRenewals: function (data) {
            var param = {
                "map": {
                    ...data,
                    "agentUuid": getAgentUuid(), //必传
                    "storeNo": getSessionStoreNo() //必传
                },
                "opeType": "searchLifePolicyRenewals"
            }
            return Axios.post('/eaddone/api/call', param)
        },
        // 财险续期列表页
        searchPropertyPolicyRenewals: function (data) {
            var param = {
                "map": {
                    ...data,
                    "agentUuid": getAgentUuid(), //必传
                    "storeNo": getSessionStoreNo() //必传
                },
                "opeType": "searchPropertyPolicyRenewals"
            }
            return Axios.post('/eaddone/api/call', param)
        },



        // --------------------- 理赔 ---------------------



        // 理赔首页轮播图
        getCarouselPicture: function (data) {
            var param = {
                "map": {
                    ...data,
                    "storeNo": getSessionStoreNo() //必传
                },
                "opeType": "getCarouselPicture"
            }
            return Axios.post('/eaddone/api/call', param)
        },
        // 理赔数据列表
        getPolicyMain: function (data) {
            var param = {
                "map": {
                    ...data,
                    "storeNo": getSessionStoreNo() //必传
                },
                "opeType": "getPolicyMain"
            }
            return Axios.post('/eaddone/api/call', param)
        },
        // 理赔数据详情
        getClaimApplyInfo: function (data) {
            var param = {
                "map": {
                    ...data,
                    "storeNo": getSessionStoreNo() //必传
                },
                "opeType": "getClaimApplyInfo"
            }
            return Axios.post('/eaddone/api/call', param)
        },
        // 常见问题
        getClaimProblems: function () {
            var param = {
                "map": {
                    "storeNo": getSessionStoreNo() //必传
                },
                "opeType": "getClaimProblems"
            }
            return Axios.post('/eaddone/api/call', param)
        },
        // 理赔工具列表
        geiClaimTools: function (data) {
            var param = {
                "map": {
                    ...data,
                    // "agentUuid": getAgentUuid(), //必传
                    "storeNo": getSessionStoreNo() //必传
                },
                "opeType": "getClaimTools"
            }
            return Axios.post('/eaddone/api/call', param)
        },
        // 理赔工具详情
        getOneClaimTools: function (data) {
            var param = {
                "map": data,
                "opeType": "getOneClaimTools"
            }
            return Axios.post('/eaddone/api/call', param)
        },



        // --------------------- 报案理赔 ---------------------



        // 分页查询理赔申请单
        getClientClaimApplyList: function (data) {
            var param = {
                "map": {
                    ...data,
                    storeNo: getSessionStoreNo(),
                    "thirdUuid": getAgentUuid()//"1",//第三方id
                },
                "opeType": "getClientClaimApplyList"
            }
            return Axios.post('/eaddone/api/call', param)
        },

        // 根据车牌号获取状态为生效，结束时间小于等于今天日期的统筹单号（保单号）
        getPolicyNoByCarPlateNumber: function (data) {
            var param = {
                "map": data,// {carNo":"1"} //车牌号
                "opeType": "getPolicyNoByCarPlateNumber"
            }
            return Axios.post('/eaddone/api/call', param)
        },

        // 用户在前台创建理赔申请单
        saveClientClaimApply: function (data) {
            var param = {
                "map": {
                    ...data,
                    storeNo: getSessionStoreNo(),//机构编号
                    thirdUuid: getAgentUuid()//"1",//第三方id
                },
                "opeType": "saveClientClaimApply"
            }
            return Axios.post('/eaddone/api/call', param)
        },


        // --------------------- 报案单管理 ---------------------

        // 报案单管理分页查询
        getReportManagementList: function (data) {
            var param = {
                "map": {
                    ...data,
                    "storeNo": "1",//机构编号
                },
                "opeType": "getReportManagementList"
            }
            return Axios.post('/eaddone/api/call', param)
        },
        // 点击查勘登记
        getEditClaimSurvey: function (data) {
            var param = {
                "map": data,
                "opeType": "getEditClaimSurvey"
            }
            return Axios.post('/eaddone/api/call', param)
        },
        // 保存查勘现场基本情况
        saveBaseClaimSurvey: function (data) {
            var param = {
                "map": data,
                "opeType": "saveBaseClaimSurvey"
            }
            return Axios.post('/eaddone/api/call', param)
        },
        // 获取车辆统筹信息
        getPolicyCar: function (data) {
            var param = {
                "map": data,
                "opeType": "getPolicyCar"
            }
            return Axios.post('/eaddone/api/call', param)
        },
        // 获取本车信息
        getBencheInfo: function (data) {
            var param = {
                "map": data,
                "opeType": "getBencheInfo"
            }
            return Axios.post('/eaddone/api/call', param)
        },

        //---------------------- 我的团队 --------------------------        
        // 育成主管
        getNurturingDirectors: function (data) {
            // erpuuid
            var param = {
                "map": data,
                "opeType": "getNurturingDirectors"
            }
            return Axios.post('/eaddone/api/call', param)
        },
        // 组织架构 数据第一层
        getFirstAgencys: function () {
            var param = {
                "opeType": "getFirstAgencys"
            }
            return Axios.post('/eaddone/api/call', param)
        },
        // 组织架构 下一级数据
        getNextAgencys: function () {
            var param = {
                "opeType": "getNextAgencys"
            }
            return Axios.post('/eaddone/api/call', param)
        },
        // 直辖增员
        getAllTeamEmployeeInfo: function (data) {
            var param = {
                "map": data,
                "opeType": "getAllTeamEmployeeInfo"
            }
            return Axios.post('/eaddone/api/call', param)
        },
        // 寿险首年业绩
        getAchievementInfos: function (data) {
            // repuuid 和日期
            var param = {
                "map": data,
                "opeType": "getAchievementInfos"
            }
            return Axios.post('/eaddone/api/call', param)
        },
        // 非车险业务
        getNocarPolicyInfos: function (data) {
            // repuuid 和日期
            var param = {
                "map": data,
                "opeType": "getNocarPolicyInfos"
            }
            return Axios.post('/eaddone/api/call', param)
        },
        // 车险业务
        getCarPolicyInfos: function (data) {
            // repuuid 和日期
            var param = {
                "map": data,
                "opeType": "getCarPolicyInfos"
            }
            return Axios.post('/eaddone/api/call', param)
        },
        // 保费预算-互联网业务
        getInternetPolicyInfos: function (data) {
            // repuuid 和日期
            var param = {
                "map": data,
                "opeType": "getInternetPolicyInfos"
            }
            return Axios.post('/eaddone/api/call', param)
        },
        // 互联网业务
        getInternetPolicyInfos: function (data) {
            // repuuid 和日期
            var param = {
                "map": data,
                "opeType": "getInternetPolicyInfos"
            }
            return Axios.post('/eaddone/api/call', param)
        },
        // 个人/团队月度保费趋势图
        getPremiumTrendChart: function (data) {
            // repuuid 和日期
            var param = {
                "map": data,
                "opeType": "getPremiumTrendChart"
            }
            return Axios.post('/eaddone/api/call', param)
        },



        // 请求参数-----查询职级列表
        getPostCodeList: function () {
            // repuuid 和日期
            var param = {
                "map": {
                    "storeNo": getSessionStoreNo()
                },
                "opeType": "getPostCodeList"
            }
            return Axios.post('/eaddone/api/call', param)
        },
        // 请求参数-----查询单个职级详情
        getPostCodeDetail: function (data) {
            // repuuid 和日期
            var param = {
                "map": {
                    ...data
                },
                "opeType": "getPostCodeDetail"
            }
            return Axios.post('/eaddone/api/call', param)
        },

        // 请求参数-----查询推荐人
        getIntroducerUuid: function () {
            // repuuid 和日期
            var param = {
                "map": {
                    "storeNo": getSessionStoreNo(),
                    "thirdUuid": 'cffccee96ff989f1016ff99278590004'//getAgentUuid()
                },
                "opeType": "getIntroducerUuid"
            }
            return Axios.post('/eaddone/api/call', param)
        },
        // 请求参数-----入司申请信息和答题问卷上传erp
        thirdAgentIncreaseApply: function () {
            // repuuid 和日期
            var param = {
                "map": {
                    "storeNo": getSessionStoreNo(),
                    "thirdUuid": 'cffccee96ff989f1016ff99278590004'//getAgentUuid()
                },
                "opeType": "thirdAgentIncreaseApply"
            }
            return Axios.post('/eaddone/api/call', param)
        },
        // 请求参数-----从erp获取审核信息
        thirdAuditInfo: function () {
            // repuuid 和日期
            var param = {
                "map": {
                    "storeNo": getSessionStoreNo(),
                    "thirdUuid": getAgentUuid()
                },
                "opeType": "thirdAuditInfo"
            }
            return Axios.post('/eaddone/api/call', param)
        },

    }
    win.ajax = ajax; // 仅暴露ajax变量
})(window)


var companyList = [{
    "companyName": "安华农业保险股份有限公司",
    "firstAlphabet": "A",
    "rectangleLogoApp": "cffccee56d82fefb016dd37b47730078",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mx36AVRiQAABZRXW074w984.png",
    "uuid": "cffccee56c981b6d016ca4e9debf0042",
    "telephone": 973374323
}, {
    "companyName": "安心财产保险有限公司",
    "firstAlphabet": "A",
    "rectangleLogoApp": "cffccee56d82fefb016dd37c65f40079",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mx8iAR7d_AAAg2yk7E1s396.png",
    "uuid": "cffccee56c981b6d016ca4efe7840046",
    "telephone": 628224359
}, {
    "companyName": "安盛天平财产保险股份有限公司",
    "firstAlphabet": "A",
    "rectangleLogoApp": "385c4ec173cd4c6d88b0435b7e271b45",
    "logoFileUrl": "https://apptest.hb-online.cn/group1/M00/00/3F/rBGxTF-jgn-AV5TJAAAaqKMAAms727.png",
    "uuid": "64a5fa35021941b0a90c8182513b67db",
    "telephone": 219362148
}, {
    "companyName": "安联财产保险（中国）有限公司",
    "firstAlphabet": "A",
    "rectangleLogoApp": "cffccee56d82fefb016dd37e8e73007a",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912myFWAODyxAABt-qbByb8341.png",
    "uuid": "cffccee56c981b6d016ca4ed72e00044",
    "telephone": 669346193
}, {
    "companyName": "安邦人寿保险股份有限公司",
    "firstAlphabet": "A",
    "rectangleLogoApp": "cffccee56d82fefb016dd3891ca2007d",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mywmAJjBuAABt3O6rsH0469.png",
    "uuid": "cffccee56c981b6d016ca4e57a58003e",
    "telephone": 803262595
}, {
    "companyName": "安邦保险集团股份有限公司",
    "firstAlphabet": "A",
    "rectangleLogoApp": "cffccee56d82fefb016dd387ca0a007c",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912myrKAZd0mAABx3wQIc9w935.png",
    "uuid": "cffccee56c981b6d016ca4f1e6a70048",
    "telephone": 353159093
}, {
    "companyName": "安邦养老保险股份有限公司",
    "firstAlphabet": "A",
    "rectangleLogoApp": "cffccee56d82fefb016dd38ba47a007e",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912my6-AN2uDAAB7sCr0V-g125.png",
    "uuid": "cffccee56c981b6d016ca4de84fc003c",
    "telephone": 508836199
}, {
    "companyName": "爱心人寿保险股份有限公司",
    "firstAlphabet": "A",
    "rectangleLogoApp": "cffccee56d82fefb016dd3f0650f0097",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m5XqAdVswAAAinuoYOhk613.png",
    "uuid": "cffccee56c981b6d016ca4e7540a0040",
    "telephone": 749478978
}, {
    "companyName": "北京人寿保险股份有限公司",
    "firstAlphabet": "B",
    "rectangleLogoApp": "cffccee56d82fefb016dd336a0490059",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mteuAO9JzAABHnM8KXmE367.png",
    "uuid": "cffccee56c981b6d016ca4fb2d0b0050",
    "telephone": 655807501
}, {
    "companyName": "北大方正人寿保险有限公司",
    "firstAlphabet": "B",
    "rectangleLogoApp": "cffccee56d82fefb016dd337ebc3005a",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mtkCAKivyAAB6GLNj29Q250.png",
    "uuid": "cffccee56c981b6d016ca4f6c15a004c",
    "telephone": 109218950
}, {
    "companyName": "渤海人寿保险股份有限公司",
    "firstAlphabet": "B",
    "rectangleLogoApp": "cffccee56d82fefb016dd3ee18750096",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m5OOAMlAAAAA_oneLqQ0067.png",
    "uuid": "cffccee56c981b6d016ca4f4f517004a",
    "telephone": 923777958
}, {
    "companyName": "百年人寿保险股份有限公司",
    "firstAlphabet": "B",
    "rectangleLogoApp": "cffccee56d82fefb016dd3f3effa009b",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m5mKAL0M4AAAyxLVnUUQ204.png",
    "uuid": "cffccee56c981b6d016ca4f89607004e",
    "telephone": 937014439
}, {
    "companyName": "诚泰财产保险股份有限公司",
    "firstAlphabet": "C",
    "rectangleLogoApp": "cffccee56d82fefb016dd3f8f79500a0",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m56uAFu3KAABEoZzHJhM452.png",
    "uuid": "cffccee56c981b6d016ca50140fb0054",
    "telephone": 789192856
}, {
    "companyName": "长城人寿保险股份有限公司",
    "firstAlphabet": "C",
    "rectangleLogoApp": "cffccee96cf70893016cf7168767004b",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/00/13/rBH3911uW8iAM5xNAAAWGhP2Fck775.jpg",
    "uuid": "ff8080816bf442f6016bf6530f730090",
    "telephone": 399288292
}, {
    "companyName": "长城人寿保险股份有限公司司",
    "firstAlphabet": "C",
    "rectangleLogoApp": "",
    "uuid": "40285b816c85ebc2016c86022b630000",
    "telephone": 1070069052
}, {
    "companyName": "长生人寿保险有限公司",
    "firstAlphabet": "C",
    "rectangleLogoApp": "cffccee56c981b6d016ca4fd29860051",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/00/0F/rBH3911ZV1aAbIfrAADTNILEeWw873.jpg",
    "uuid": "cffccee56c981b6d016ca4fd299f0052",
    "telephone": 1077094925
}, {
    "companyName": "东吴人寿保险股份有限公司",
    "firstAlphabet": "D",
    "rectangleLogoApp": "cffccee56d82fefb016dd243c02e002d",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912md76AX-mCAABNBIYQ-wU320.png",
    "uuid": "cffccee56c981b6d016ca502c0f20056",
    "telephone": 515883947
}, {
    "companyName": "大家保险集团有限责任公司",
    "firstAlphabet": "D",
    "rectangleLogoApp": "47bb721a72778e8a0172796f1ec6065a",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/EC/rBH3917XaDiAZe4xAABe3-IZ__4098.jpg",
    "uuid": "47bb721a72778e8a0172796f1f09065b",
    "telephone": 195801059
}, {
    "companyName": "德华安顾人寿保险有限公司",
    "firstAlphabet": "D",
    "rectangleLogoApp": "cffccee56d82fefb016dd394f9470087",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mzhKAc1_EAAA62uAL-F8972.png",
    "uuid": "cffccee56c981b6d016ca50543530058",
    "telephone": 516549574
}, {
    "companyName": "都帮财产保险股份有限公司",
    "firstAlphabet": "D",
    "rectangleLogoApp": "cffccee56c981b6d016ca506d2ab0059",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/00/0F/rBH3911ZWc-AHNtuAABpwKqG_js709.jpg",
    "uuid": "cffccee56c981b6d016ca506d2c4005a",
    "telephone": 396002534
}, {
    "companyName": "复星保德信人寿保险有限公司",
    "firstAlphabet": "F",
    "rectangleLogoApp": "cffccee56d82fefb016dd36584ed0071",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mweyAa_7PAABai34gIek404.png",
    "uuid": "cffccee56c981b6d016ca51067db0062",
    "telephone": 524935496
}, {
    "companyName": "复星联合健康保险股份有限公司",
    "firstAlphabet": "F",
    "rectangleLogoApp": "cffccee56d82fefb016dd366906c0072",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mwjGAMRKQAAA2gte8gW0399.png",
    "uuid": "cffccee56c981b6d016ca50c3369005e",
    "telephone": 308138235
}, {
    "companyName": "富德生命人寿保险股份有限公司",
    "firstAlphabet": "F",
    "rectangleLogoApp": "cffccee56d82fefb016dd38c872d007f",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912my-mAaks5AAA3AmL0nOQ185.png",
    "uuid": "cffccee56c981b6d016ca5099f85005c",
    "telephone": 494883064
}, {
    "companyName": "富德财产保险股份有限公司",
    "firstAlphabet": "F",
    "rectangleLogoApp": "cffccee56d82fefb016dd38d1e570080",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mzA-ARnVIAABq1r-5xNI943.png",
    "uuid": "cffccee56c981b6d016ca51347910065",
    "telephone": 388817536
}, {
    "companyName": "光大永明人寿保险有限公司",
    "firstAlphabet": "G",
    "rectangleLogoApp": "cffccee971c5d286017212a0165f49f8",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/E1/rBH39169FoyAPc-2AAAoY3XkWMg675.png",
    "uuid": "ff8080816bf442f6016bf6535b210091",
    "telephone": 834790392
}, {
    "companyName": "国华人寿保险股份有限公司",
    "firstAlphabet": "G",
    "rectangleLogoApp": "cffccee56d82fefb016dd3587a09006d",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mvpWAKm4FAAA8YPiAaXs074.png",
    "uuid": "cffccee56c981b6d016ca5197c83006b",
    "telephone": 935345044
}, {
    "companyName": "国宝人寿保险股份有限公司",
    "firstAlphabet": "G",
    "rectangleLogoApp": "47bb721a72778e8a0172797653b9065d",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/EC/rBH3917XahGASNQsAAA7UG_vWLE712.png",
    "uuid": "47bb721a72778e8a0172797653df065e",
    "telephone": 636772236
}, {
    "companyName": "国富人寿保险股份有限公司",
    "firstAlphabet": "G",
    "rectangleLogoApp": "47bb721a72778e8a017279799ce1065f",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/EC/rBH3917XauiACuFkAAAWZzIWCJ0784.png",
    "uuid": "47bb721a72778e8a017279799d050660",
    "telephone": 350827564
}, {
    "companyName": "国泰人寿保险有限责任公司",
    "firstAlphabet": "G",
    "rectangleLogoApp": "cffccee56d82fefb016dd35ae3c6006e",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mvzSANO0nAABXTyE4YHA274.png",
    "uuid": "cffccee56c981b6d016ca515310b0067",
    "telephone": 612866412
}, {
    "companyName": "国泰财产保险有限责任公司",
    "firstAlphabet": "G",
    "rectangleLogoApp": "cffccee56d82fefb016dd35c98ca006f",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mv6OAeWYvAABnZt5lPiE563.png",
    "uuid": "cffccee56c981b6d016ca51f9915006f",
    "telephone": 424780531
}, {
    "companyName": "国联人寿保险股份有限公司",
    "firstAlphabet": "G",
    "rectangleLogoApp": "cffccee56d82fefb016dd363c2740070",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mwXmAauMlAAA2gaoJu1s215.png",
    "uuid": "cffccee56c981b6d016ca517514b0069",
    "telephone": 205789398
}, {
    "companyName": "工银安盛人寿保险有限公司",
    "firstAlphabet": "G",
    "rectangleLogoApp": "cffccee56c981b6d016ca51d97d6006c",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/00/0F/rBH3911ZX6OAbd0FAACEEmutCaw218.jpg",
    "uuid": "cffccee56c981b6d016ca51d97f0006d",
    "telephone": 237283971
}, {
    "companyName": "华夏人寿保险股份有限公司",
    "firstAlphabet": "H",
    "rectangleLogoApp": "cffccee56d82fefb016dd338f3c1005b",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mtoOAcQTGAABGraNC9RY534.png",
    "uuid": "cffccee56c981b6d016ca538f2ec0073",
    "telephone": 104460361
}, {
    "companyName": "华安财产保险股份有限公司",
    "firstAlphabet": "H",
    "rectangleLogoApp": "cffccee56d82fefb016dd33a6a8b005c",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mtuOAdXHSAABdI-M6la0017.png",
    "uuid": "cffccee56c981b6d016ca556e8cb008b",
    "telephone": 868807518
}, {
    "companyName": "华汇人寿保险股份有限公司",
    "firstAlphabet": "H",
    "rectangleLogoApp": "cffccee56d82fefb016dd33b6619005d",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mtySARaCJAABNUrMjaWE752.png",
    "uuid": "cffccee56c981b6d016ca53c06e70077",
    "telephone": 456219484
}, {
    "companyName": "华泰人寿保险股份有限公司",
    "firstAlphabet": "H",
    "rectangleLogoApp": "cffccee56d82fefb016dd33cba68005e",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mt3uAXc9gAABFpd8_x6M542.png",
    "uuid": "cffccee56c981b6d016ca53a61180075",
    "telephone": 1058736707
}, {
    "companyName": "华泰财产保险股份有限公司",
    "firstAlphabet": "H",
    "rectangleLogoApp": "cffccee56d82fefb016dd33ed5ea005f",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912muAWAP6yFAABM9zF2FWc464.png",
    "uuid": "cffccee56c981b6d016ca5588e45008d",
    "telephone": 134837681
}, {
    "companyName": "华海财产保险股份有限公司",
    "firstAlphabet": "H",
    "rectangleLogoApp": "cffccee56d82fefb016dd341cb240060",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912muMeADn1pAAA1nCBq6WQ422.png",
    "uuid": "cffccee56c981b6d016ca5559d450089",
    "telephone": 712450048
}, {
    "companyName": "华贵人寿保险股份有限公司",
    "firstAlphabet": "H",
    "rectangleLogoApp": "cffccee56d82fefb016dd34463420061",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912muXGAE4Z-AABGeJTLikU288.png",
    "uuid": "cffccee56c981b6d016ca53ead440079",
    "telephone": 128195449
}, {
    "companyName": "合众人寿保险股份有限公司",
    "firstAlphabet": "H",
    "rectangleLogoApp": "cffccee56d82fefb016dd34d988f0066",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mu8yAPe52AAAtIpbaglk847.png",
    "uuid": "cffccee56c981b6d016ca551e0cf0085",
    "telephone": 382001951
}, {
    "companyName": "和泰人寿保险股份有限公司",
    "firstAlphabet": "H",
    "rectangleLogoApp": "cffccee56d82fefb016dd353ceee006b",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mvWSAFotRAAA4Es0oEGs604.png",
    "uuid": "cffccee56c981b6d016ca54f81120083",
    "telephone": 288305079
}, {
    "companyName": "和谐健康保险股份有限公司",
    "firstAlphabet": "H",
    "rectangleLogoApp": "cffccee56d82fefb016dd356bd3d006c",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mviSAZoOrAAAu7C9LCCc519.png",
    "uuid": "cffccee56c981b6d016ca5476f5f0081",
    "telephone": 290362606
}, {
    "companyName": "弘康人寿保险股份有限公司",
    "firstAlphabet": "H",
    "rectangleLogoApp": "cffccee56d82fefb016dd394558e0086",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mzeiATIg5AABZQ5pwahw883.png",
    "uuid": "cffccee56c981b6d016ca54039d0007b",
    "telephone": 338139299
}, {
    "companyName": "恒大人寿保险有限公司",
    "firstAlphabet": "H",
    "rectangleLogoApp": "cffccee56d82fefb016dd395a4c90088",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912mzj6AWBO2AABVOs_0a5Y014.png",
    "uuid": "ff8080816bf442f6016bf652a7c7008f",
    "telephone": 609342259
}, {
    "companyName": "恒安标准人寿保险有限公司",
    "firstAlphabet": "H",
    "rectangleLogoApp": "cffccee56d82fefb016dd396642a0089",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912mzm-AU6BRAABpu0qTj-E937.png",
    "uuid": "cffccee56c981b6d016ca5456891007f",
    "telephone": 866298470
}, {
    "companyName": "横琴人寿保险有限公司",
    "firstAlphabet": "H",
    "rectangleLogoApp": "cffccee56d82fefb016dd3dd5272008f",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m4JiAFO0nAABWpnR0P8c064.png",
    "uuid": "cffccee56c981b6d016ca54240f6007d",
    "telephone": 122355707
}, {
    "companyName": "汇丰人寿保险有限公司",
    "firstAlphabet": "H",
    "rectangleLogoApp": "cffccee56d82fefb016dd3e93b930092",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m46SAcRqGAABFK1eOILw433.png",
    "uuid": "cffccee56c981b6d016ca537a9a50071",
    "telephone": 471234967
}, {
    "companyName": "海保人寿保险股份有限公司",
    "firstAlphabet": "H",
    "rectangleLogoApp": "cffccee56c981b6d016ca55a2941008e",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/00/0F/rBH3911ZbyWAX9GtAAAywYV-3JI769.jpg",
    "uuid": "cffccee56c981b6d016ca55a2960008f",
    "telephone": 507323861
}, {
    "companyName": "交银康联人寿保险有限公司",
    "firstAlphabet": "J",
    "rectangleLogoApp": "cffccee56d82fefb016dd321960d004e",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912msIiALV_yAABRBk_uPJg799.png",
    "uuid": "cffccee56ca562f0016ca56567030000",
    "telephone": 486566202
}, {
    "companyName": "吉祥人寿保险股份有限公司",
    "firstAlphabet": "J",
    "rectangleLogoApp": "cffccee56d82fefb016dd34f96960067",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mvE-AQRd-AABbHxVshQM403.png",
    "uuid": "cffccee56ca562f0016ca56b66ab0004",
    "telephone": 515507004
}, {
    "companyName": "君康人寿保险股份有限公司",
    "firstAlphabet": "J",
    "rectangleLogoApp": "cffccee56d82fefb016dd35157e00069",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mvMKAQRN0AAA_dyq1eqo187.png",
    "uuid": "cffccee56c981b6d016ca55e451a0093",
    "telephone": 832841932
}, {
    "companyName": "君龙人寿保险有限公司",
    "firstAlphabet": "J",
    "rectangleLogoApp": "cffccee56d82fefb016dd352885f006a",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mvRCAAH4oAABPHv1AceE897.png",
    "uuid": "cffccee56c981b6d016ca55c06380091",
    "telephone": 519144240
}, {
    "companyName": "建信人寿保险有限公司",
    "firstAlphabet": "J",
    "rectangleLogoApp": "cffccee56d82fefb016dd39376370085",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mza-AT2ezAAAyUIyKtrA206.png",
    "uuid": "cffccee56ca562f0016ca5692bef0002",
    "telephone": 608922257
}, {
    "companyName": "昆仑健康保险股份有限公司",
    "firstAlphabet": "K",
    "rectangleLogoApp": "cffccee96cdc1862016cdc52784c0023",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/00/12/rBH3911ngaeAJjh6AAAKa0UOsbk267.jpg",
    "uuid": "cffccee56ca562f0016ca56e64d20005",
    "telephone": 964450240
}, {
    "companyName": "利安人寿保险股份有限公司",
    "firstAlphabet": "L",
    "rectangleLogoApp": "cffccee56d82fefb016dd32ba0e40055",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912msxqAY63nAAAmP9wOziA998.png",
    "uuid": "cffccee56ca5736e016ca57b197c0006",
    "telephone": 929372590
}, {
    "companyName": "利宝保险有限公司",
    "firstAlphabet": "L",
    "rectangleLogoApp": "cffccee56d82fefb016dd32ff5230057",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mtDaAY-W5AABZc662M6Y744.png",
    "uuid": "cffccee56ca5736e016ca57e2d6e0009",
    "telephone": 916147071
}, {
    "companyName": "陆家嘴国泰人寿保险有限责任公司",
    "firstAlphabet": "L",
    "rectangleLogoApp": "cffccee56d82fefb016dd3fe8de100a3",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m6RqAV3t0AABm7Y9gFPc068.png",
    "uuid": "cffccee56ca5736e016ca58b74ae0014",
    "telephone": 607046410
}, {
    "companyName": "民生人寿保险股份有限公司",
    "firstAlphabet": "M",
    "rectangleLogoApp": "cffccee56d82fefb016dd3e5c3730090",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m4sGALsObAABe7B7hNcQ201.png",
    "uuid": "cffccee56ca5736e016ca581dc3e000c",
    "telephone": 147138561
}, {
    "companyName": "美亚财产保险公司",
    "firstAlphabet": "M",
    "rectangleLogoApp": "cffccee56d82fefb016dd3f61419009d",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m5u6AVb8yAABBLN2GguQ829.png",
    "uuid": "cffccee56ca5736e016ca583aaf30010",
    "telephone": 849919080
}, {
    "companyName": "农银人寿保险股份有限公司",
    "firstAlphabet": "N",
    "rectangleLogoApp": "cffccee56d82fefb016dd32ab15b0054",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mst2AEtKkAABWaDGiJCA396.png",
    "uuid": "cffccee56ca5736e016ca585b7f40012",
    "telephone": 103256285
}, {
    "companyName": "平安健康保险股份有限公司",
    "firstAlphabet": "P",
    "rectangleLogoApp": "cffccee56d82fefb016dd38db0bd0081",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mzDWAKy8fAABejSQpwHw336.png",
    "uuid": "cffccee56ca5736e016ca7d5335d0035",
    "telephone": 602482443
}, {
    "companyName": "平安养老保险股份有限公司",
    "firstAlphabet": "P",
    "rectangleLogoApp": "cffccee56d82fefb016dd39110250082",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mzRKAO2PyAABZE9b9HlE960.png",
    "uuid": "cffccee56ca5736e016ca7d31ce40032",
    "telephone": 751034492
}, {
    "companyName": "平安财产保险股份有限公司",
    "firstAlphabet": "P",
    "rectangleLogoApp": "cffccee56d82fefb016dd391a1fe0083",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mzTeAAv3LAABwYwfAW9U562.png",
    "uuid": "cffccee56ca5736e016ca86aef620040",
    "telephone": 818373247
}, {
    "companyName": "前海人寿保险股份有限公司",
    "firstAlphabet": "Q",
    "rectangleLogoApp": "cffccee56d82fefb016dd33380be0058",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mtR6ANj8GAABZb6gvxXc669.png",
    "uuid": "cffccee56ca5736e016ca86d27d80042",
    "telephone": 149928559
}, {
    "companyName": "瑞华健康保险股份有限公司",
    "firstAlphabet": "R",
    "rectangleLogoApp": "cffccee56d82fefb016dd3f22b9c0099",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m5e6AfuNxAAA-t_YB_Qk371.png",
    "uuid": "cffccee56ca5736e016ca8705afc0046",
    "telephone": 489932256
}, {
    "companyName": "瑞泰人寿保险有限公司",
    "firstAlphabet": "R",
    "rectangleLogoApp": "cffccee56d82fefb016dd3f3316b009a",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m5jGAH6mgAACA5WiS7dM945.png",
    "uuid": "cffccee56ca5736e016ca86eed630044",
    "telephone": 482241851
}, {
    "companyName": "三峡人寿保险股份有限公司",
    "firstAlphabet": "S",
    "rectangleLogoApp": "47bb721a72778e8a01727990edf20675",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/EC/rBH3917XcOCAVLhsAAAmKs6MBP8916.png",
    "uuid": "47bb721a72778e8a01727990ee0e0676",
    "telephone": 498037124
}, {
    "companyName": "上海人寿保险股份有限公司",
    "firstAlphabet": "S",
    "rectangleLogoApp": "cffccee56d82fefb016dd241c0a6002c",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mdzuAdSMcAABW-_y-800032.png",
    "uuid": "cffccee56ca5736e016ca87f3f23004e",
    "telephone": 1029595817
}, {
    "companyName": "史带财产保险股份有限公司",
    "firstAlphabet": "S",
    "rectangleLogoApp": "cffccee56d82fefb016dd34cb7d40065",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mu5OARVRvAABMrwHLb_Q920.png",
    "uuid": "cffccee56ca5736e016ca88222880070",
    "telephone": 472564892
}, {
    "companyName": "苏黎世保险公司",
    "firstAlphabet": "S",
    "rectangleLogoApp": "cffccee56d82fefb016dd3f71938009e",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m5zGARDyQAABVhlTpaEI018.png",
    "uuid": "cffccee56ca5736e016ca883d3cb0072",
    "telephone": 796658850
}, {
    "companyName": "同方全球人寿保险有限公司",
    "firstAlphabet": "T",
    "rectangleLogoApp": "cffccee56d82fefb016dd35087da0068",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mvI2ABsVvAAA_WENq2hM946.png",
    "uuid": "cffccee56ca5736e016ca898f4f60075",
    "telephone": 651822707
}, {
    "companyName": "天安人寿保险股份有限公司",
    "firstAlphabet": "T",
    "rectangleLogoApp": "cffccee56d82fefb016dd36e54cd0073",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mxC6AKvLYAABVbhF3X44383.png",
    "uuid": "cffccee56ca5736e016ca89a4b750077",
    "telephone": 576686629
}, {
    "companyName": "天安财产保险股份有限公司",
    "firstAlphabet": "T",
    "rectangleLogoApp": "cffccee56d82fefb016dd36f5a740074",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mxHGAdsEFAAA87L1_XQw237.png",
    "uuid": "cffccee96ca8a430016ca8ae2d800005",
    "telephone": 543550291
}, {
    "companyName": "太保安联健康保险股份有限公司",
    "firstAlphabet": "T",
    "rectangleLogoApp": "cffccee96ca8a430016ca8a9ff6c0000",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/00/10/rBH3911aSDCAKk6BAAAVgitBoIg443.png",
    "uuid": "cffccee96ca8a430016ca8a9ffef0001",
    "telephone": 757989101
}, {
    "companyName": "太平人寿保险有限公司",
    "firstAlphabet": "T",
    "rectangleLogoApp": "cffccee56d82fefb016dd3728e720075",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mxUOACrj8AAAylXI335A084.png",
    "uuid": "cffccee56ca5736e016ca8a0928e007f",
    "telephone": 278661937
}, {
    "companyName": "太平养老保险股份有限公司",
    "firstAlphabet": "T",
    "rectangleLogoApp": "cffccee56d82fefb016dd376cda00076",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mxlmASQAZAABWSfeWdlM790.png",
    "uuid": "cffccee56ca5736e016ca89f12c7007d",
    "telephone": 451543052
}, {
    "companyName": "太平财产保险有限公司",
    "firstAlphabet": "T",
    "rectangleLogoApp": "cffccee56d82fefb016dd378d5930077",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mxt6Aaj9GAACAgRiBcY4469.png",
    "uuid": "cffccee96ca8a430016ca8afe7a10007",
    "telephone": 528193104
}, {
    "companyName": "泰康人寿保险股份有限公司",
    "firstAlphabet": "T",
    "rectangleLogoApp": "cffccee56d82fefb016dd3e9f88e0093",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m49WAfr9yAAA7Zmuhmyg546.png",
    "uuid": "cffccee56ca5736e016ca89d87dd007b",
    "telephone": 273492919
}, {
    "companyName": "泰康养老保险股份有限公司",
    "firstAlphabet": "T",
    "rectangleLogoApp": "cffccee56d82fefb016dd3eba22a0094",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m5EKAclXwAABJ7VamoIc674.png",
    "uuid": "cffccee56ca5736e016ca89be9350079",
    "telephone": 149787795
}, {
    "companyName": "泰康在线财产保险股份有限公司",
    "firstAlphabet": "T",
    "rectangleLogoApp": "cffccee56d82fefb016dd3ec56850095",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m5HCAPMYfAAArtIhTUtE483.png",
    "uuid": "cffccee96ca8a430016ca8ac7b6f0003",
    "telephone": 657902774
}, {
    "companyName": "网金保险销售服务有限公司",
    "firstAlphabet": "W",
    "rectangleLogoApp": "cffccee56d82fefb016dd3f517a7009c",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m5q2AQUbuAABoa6Rpd0U133.png",
    "uuid": "cffccee96ca8a430016ca8b2a8930009",
    "telephone": 105163611
}, {
    "companyName": "信泰人寿保险股份有限公司",
    "firstAlphabet": "X",
    "rectangleLogoApp": "cffccee56d82fefb016dd3247d390051",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912msUaAHMCIAABLku1JXsY551.png",
    "uuid": "cffccee96ca8a430016ca8b5ad42000d",
    "telephone": 453378514
}, {
    "companyName": "信美人寿相互保险社",
    "firstAlphabet": "X",
    "rectangleLogoApp": "cffccee56d82fefb016dd327789e0052",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912msgqAUHkAAAB8BCjBFqI689.png",
    "uuid": "cffccee96ca8a430016ca8b79478000f",
    "telephone": 297021652
}, {
    "companyName": "信诚人寿保险有限公司",
    "firstAlphabet": "X",
    "rectangleLogoApp": "cffccee56d82fefb016dd328e5b40053",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912msmeABCa-AAA3W4Ywc2I769.png",
    "uuid": "cffccee96ca8a430016ca8b91f5f0011",
    "telephone": 924901071
}, {
    "companyName": "幸福人寿保险股份有限公司",
    "firstAlphabet": "X",
    "rectangleLogoApp": "cffccee56d82fefb016dd3929f1e0084",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mzXiAZbzpAAA_BN4ni28174.png",
    "uuid": "cffccee96ca8a430016ca8b3feb2000b",
    "telephone": 342638930
}, {
    "companyName": "新华人寿保险股份有限公司",
    "firstAlphabet": "X",
    "rectangleLogoApp": "cffccee56d82fefb016dd3d04edd008c",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m3UOABWCwAABH7dgCyfo127.png",
    "uuid": "cffccee96ca8a430016ca8bac67b0013",
    "telephone": 249805282
}, {
    "companyName": "新疆前海联合财产保险股份有限公司",
    "firstAlphabet": "X",
    "rectangleLogoApp": "cffccee56d82fefb016dd3d8c6ee008d",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m326AX6TtAABAtzkTGws134.png",
    "uuid": "cffccee96ca8a430016ca8c046710017",
    "telephone": 1097042286
}, {
    "companyName": "亚太财产保险有限公司",
    "firstAlphabet": "Y",
    "rectangleLogoApp": "cffccee56d82fefb016dd31ffe29004d",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912msCCAQJREAABEV4--C_g337.png",
    "uuid": "cffccee96ca8a430016ca8cc081b0023",
    "telephone": 782185348
}, {
    "companyName": "友邦保险有限公司",
    "firstAlphabet": "Y",
    "rectangleLogoApp": "cffccee56d82fefb016dd34a20100064",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912muumAKBPXAAA_R2Ba0cE629.png",
    "uuid": "cffccee96ca8a430016ca8c8934e001f",
    "telephone": 1004498304
}, {
    "companyName": "友邦保险有限公司上海分公司",
    "firstAlphabet": "Y",
    "rectangleLogoApp": "cffccee56d82fefb016dd349ed730063",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mutyAJH41AAA_R2Ba0cE448.png",
    "uuid": "cffccee96ca8a430016ca8c2eae80019",
    "telephone": 114409815
}, {
    "companyName": "易安财产保险股份有限公司",
    "firstAlphabet": "Y",
    "rectangleLogoApp": "cffccee56d82fefb016dd3db5ead008e",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m4BiAR6npAABQF90-Iww560.png",
    "uuid": "cffccee96ca8a430016ca8ca5b180021",
    "telephone": 823016186
}, {
    "companyName": "永安财产保险股份有限公司",
    "firstAlphabet": "Y",
    "rectangleLogoApp": "cffccee56d82fefb016dd3e75fa10091",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m4yqAVkUjAABb_JTINxs486.png",
    "uuid": "cffccee96ca8a430016ca8cdf1d00029",
    "telephone": 436483231
}, {
    "companyName": "英大泰和人寿保险股份有限公司",
    "firstAlphabet": "Y",
    "rectangleLogoApp": "cffccee56d82fefb016dd3f8772c009f",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m54qAYBcSAABSlg3Zzco092.png",
    "uuid": "cffccee96ca8a430016ca8c5f094001b",
    "telephone": 940381529
}, {
    "companyName": "阳光人寿保险股份有限公司",
    "firstAlphabet": "Y",
    "rectangleLogoApp": "cffccee56d82fefb016dd3fc19dc00a1",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m6HmAB0q3AAB1LImMbNQ162.png",
    "uuid": "cffccee96ca8a430016ca8c764bd001d",
    "telephone": 559992761
}, {
    "companyName": "阳光财产保险股份有限公司",
    "firstAlphabet": "Y",
    "rectangleLogoApp": "cffccee56d82fefb016dd3fcd62300a2",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m6KmAB1UPAABX9_i7NNo998.png",
    "uuid": "cffccee96ca8a430016ca8d046df002d",
    "telephone": 344010044
}, {
    "companyName": "中信保诚人寿保险有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd246caa7002e",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912meIWARtmuAAA3MCydX9g658.png",
    "uuid": "cffccee96ca8a430016ca90847ec0079",
    "telephone": 1054361766
}, {
    "companyName": "中华联合人寿保险股份有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd24da8ac0031",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mekeAZzgtAAA4yZMS_Vs366.png",
    "uuid": "cffccee96ca8a430016ca8e351740045",
    "telephone": 528232509
}, {
    "companyName": "中华联合保险控股股份有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd24d792d0030",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mejuAPOj5AAA3NLuFgKQ160.png",
    "uuid": "cffccee96ca8a430016ca916e8eb008d",
    "telephone": 981045636
}, {
    "companyName": "中华联合保险集团股份有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "47bb721a72778e8a0172799980160677",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/EC/rBH3917XcxKAS8DmAAAnIBWkJSc861.jpg",
    "uuid": "47bb721a72778e8a0172799980310678",
    "telephone": 311751547
}, {
    "companyName": "中原农业保险股份有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd2507e000032",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mewGAaRkGAABEMCENtww864.png",
    "uuid": "cffccee96ca8a430016ca91465af0088",
    "telephone": 795158410
}, {
    "companyName": "中国人寿保险股份有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd252f9790035",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912me6SAQVAUAAA-yZNfaxU454.png",
    "uuid": "cffccee96ca8a430016ca8eb54690051",
    "telephone": 577164505
}, {
    "companyName": "中国人寿财产保险股份有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd252cd9a0034",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912me5iAVj_YAAA1I4-H5nE972.png",
    "uuid": "cffccee96ca8a430016ca905ab5e0076",
    "telephone": 146096891
}, {
    "companyName": "中国人民人寿保险股份有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd2570a250037",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mfK6AOpU3AAA5YjkU4po577.png",
    "uuid": "cffccee96ca8a430016ca8ed03460053",
    "telephone": 900212352
}, {
    "companyName": "中国人民健康保险股份有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd259bd650038",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mfV-AbNC6AABNGd_fZE8607.png",
    "uuid": "cffccee96ca8a430016ca8efd7410056",
    "telephone": 204944213
}, {
    "companyName": "中国人民财产保险股份有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd25af4430039",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mfa-AR_qUAAA7sxzqeUM840.png",
    "uuid": "cffccee96ca8a430016ca91079a40080",
    "telephone": 928528762
}, {
    "companyName": "中国大地财产保险股份有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd25c20c9003a",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mffyAJ0r_AAAv-DaGiDg980.png",
    "uuid": "cffccee96ca8a430016ca9034f940074",
    "telephone": 518804484
}, {
    "companyName": "中国太平保险集团有限责任公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd25d1067003b",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mfjmAKBTDAABU4mKQhXY614.png",
    "uuid": "cffccee96ca8a430016ca8fdf206006b",
    "telephone": 941506648
}, {
    "companyName": "中国太平洋人寿保险股份有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd25e175d003c",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mfnyAC3wtAABTgHG5Iy4619.png",
    "uuid": "cffccee96ca8a430016ca8e9af3a004d",
    "telephone": 572793790
}, {
    "companyName": "中国太平洋财产保险股份有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd25f20ea003d",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mfsCAIw1eAAAw3qquGus876.png",
    "uuid": "cffccee96ca8a430016ca901b5a60072",
    "telephone": 562923508
}, {
    "companyName": "中国平安人寿保险股份有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd26042ce003e",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mfwqAXJFgAABejSQpwHw835.png",
    "uuid": "cffccee96ca8a430016ca8f1452b0058",
    "telephone": 135277608
}, {
    "companyName": "中国平安保险（集团）股份有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd260d967003f",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mfzGAatY9AABejSQpwHw448.png",
    "uuid": "cffccee96ca8a430016ca8ff8cbb006f",
    "telephone": 700918996
}, {
    "companyName": "中宏人寿保险有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd26288a50040",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mf5-AK82jAABeJwLb6Mg653.png",
    "uuid": "cffccee96ca8a430016ca8e4c96e0047",
    "telephone": 706592064
}, {
    "companyName": "中德安联人寿保险有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd268dd740041",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mgT6AH9cmAAA4nMpvgek260.png",
    "uuid": "cffccee96ca8a430016ca8f39ad6005d",
    "telephone": 860442584
}, {
    "companyName": "中意人寿保险有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd27796120042",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mhQOAKUrLAAA7u6O3h1A889.png",
    "uuid": "cffccee96ca8a430016ca8da58d70038",
    "telephone": 972777047
}, {
    "companyName": "中法人寿保险有限责任公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd279d6d40043",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mhZeAFmdyAABiQ5ilNtA627.png",
    "uuid": "cffccee96ca8a430016ca8f26f0e005b",
    "telephone": 978764270
}, {
    "companyName": "中美联泰大都会人寿保险有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd27c09960044",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mhieAEib8AAAggL7RBrE167.png",
    "uuid": "cffccee96ca8a430016ca8e162960042",
    "telephone": 329658367
}, {
    "companyName": "中航三星保险有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd29a40d90045",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mjeOAMmg3AABZl0yEXb0172.png",
    "uuid": "cffccee96ca8a430016ca8f8f5000063",
    "telephone": 799141789
}, {
    "companyName": "中英人寿保险有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd30ff36b0046",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mrASAPVSSAAAyHbbpw9Q400.png",
    "uuid": "cffccee96ca8a430016ca8d7a6040034",
    "telephone": 949146284
}, {
    "companyName": "中荷人寿保险有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd31118cc0047",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mrFCAVbkEAAA0-e1rgT4619.png",
    "uuid": "cffccee96ca8a430016ca8e697000049",
    "telephone": 986990491
}, {
    "companyName": "中融人寿保险股份有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd317c3970048",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mrgSAS6AHAABjlRVGx1s936.png",
    "uuid": "cffccee96ca8a430016ca8de9711003c",
    "telephone": 669118222
}, {
    "companyName": "中路财产保险股份有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd31965a10049",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mrm-AKrBQAABO7j_Lwd0974.png",
    "uuid": "cffccee96ca8a430016ca9132f0d0085",
    "telephone": 999061663
}, {
    "companyName": "中邮人寿保险股份有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd31d079d004a",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mr16AXq5tAAA0fdWuh1E384.png",
    "uuid": "cffccee96ca8a430016ca8d62e900032",
    "telephone": 166814212
}, {
    "companyName": "中银三星人寿保险有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd31d81da004b",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mr32AG9AKAABZl0yEXb0983.png",
    "uuid": "cffccee96ca8a430016ca8d94a890036",
    "telephone": 524154592
}, {
    "companyName": "中韩人寿保险有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd31ebdaf004c",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912mr86AVxE9AAA4BT8aUjA097.png",
    "uuid": "cffccee96ca8a430016ca8e81e39004b",
    "telephone": 1085893906
}, {
    "companyName": "众安在线财产保险股份有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd323bdf00050",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0B/rBH3912msRWAObs8AAApR8KhhNg658.png",
    "uuid": "cffccee96ca8a430016ca8fc41540068",
    "telephone": 1094779757
}, {
    "companyName": "招商人寿保险股份有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd397045c008a",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912mzpiAXWwMAABByPWl9PQ538.png",
    "uuid": "cffccee96ca8a430016ca8f72edc0061",
    "telephone": 899280024
}, {
    "companyName": "招商局仁和人寿保险股份有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd3a28731008b",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m0YuAJpESAABTMExlZGQ272.png",
    "uuid": "cffccee96ca8a430016ca90be8b4007b",
    "telephone": 245515333
}, {
    "companyName": "珠江人寿保险股份有限公司",
    "firstAlphabet": "Z",
    "rectangleLogoApp": "cffccee56d82fefb016dd3f125130098",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/04/0C/rBH3912m5auARNT_AABH2mS0no4957.png",
    "uuid": "cffccee96ca8a430016ca8d4c8220030",
    "telephone": 807239194
}, {
    "companyName": "中国太平洋财产保险股份有限公司",
    "firstAlphabet": "#",
    "rectangleLogoApp": "cffccee96c79af2b016c79b05ce80001",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/00/0D/rBH3911OQaCAWSerAAAUMV7apbY834.png",
    "uuid": "40285b8168514d900168515163940000",
    "telephone": 695461491
}, {
    "companyName": "111111111中国太平洋财产保险股份有限公司",
    "firstAlphabet": "#",
    "rectangleLogoApp": "cffccee96c79af2b016c79b05ce80001",
    "logoFileUrl": "https://www.upfreely.online/group1/M00/00/0D/rBH3911OQaCAWSerAAAUMV7apbY834.png",
    "uuid": "40285b8168514d900168515163940000",
    "telephone": 122424597
}]