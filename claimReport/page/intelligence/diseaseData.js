var localName = {
	data: 'disease_data',
	person: 'disease_people',
	currentPerson: 'disease_current_person'
}
// 处理缓存
var getLocalData = {
	// 获取当前选中的疾病小类索引
	getData: function() {
		var local = localStorage.getItem(localName.data)
		local = local || '[]'
		try {
			local = JSON.parse(local)
		} catch (error) {
			local = []
		}
		return local
	},
	// 存入当前选中的疾病小类索引
	setData: function(data) {
		localStorage.setItem(localName.data, JSON.stringify(data))
	},
	// 获取根据url参数给的被保人chooseInsids获取并重组过的数据（后台保存的数据）
	getPerson: function() {
		var local = localStorage.getItem(localName.person)
		local = local || '[]'
		try {
			local = JSON.parse(local)
		} catch (error) {
			local = []
		}
		return local
	},
	// 存入信息
	setPerson: function(data) {
		localStorage.setItem(localName.person, JSON.stringify(data))
	},
	// 获取当前操作人的索引值
	getCurrentPerson: function() {
		var local = localStorage.getItem(localName.currentPerson)
		local = local || ''
		try {
			local = JSON.parse(local)
		} catch (error) {
			local = ''
		}
		return local
	},
	// 存入当前操作人的索引值
	setCurrentPerson: function(data) {
		localStorage.setItem(localName.currentPerson, JSON.stringify(data))
	},
	clearAll: function() {
		this.setData([])
		this.setPerson([])
		this.setCurrentPerson('')
	}
}
/**
 * 答案类型
 * [0, 1]的形式
 * 
 * */
var answersType = [
	['否', '是'],
	['只一侧有', '两侧都曾有过'],
	['现症', '既往史'],
	['是']
]
/**
 * 问卷疾病映射数据
 * 
 
 思路描述：
		该问卷调查的思路是已数组索引的形式做出的一个数据格式。答案格式单独列出，除责、拒保、核保通过、问题步骤的数据都为索引+当前选择			答案类型的索引，索引值 + #进行强制结尾
 
 数据结构：
		疾病大类 -> 疾病小类 -> 疾病下的问题明细以及答案选择明细 三维数组构成的数据

字段描述：
		jubao // 拒保 1是 0否 -1 不清楚 [必填]
		hebao // 核保通过 1是 0否 -1 不清楚 [必填]
		chuze // 是否除责 [必填]
		note // 除责话术 [必填]
		mixedQuestion // 是true的话，混合性问题，带跳转的[不必填]
		questionStep // 问题步骤* [必填]
				// 举个栗子：'索引/是或否的索引,索引/是或否的索引/#(# 代表 强制结束)'
				eg:['0/0,2/0'] //  第一个问题选择第一个选项后，显示第三个问题,如果第三个问题的选项选择的是答案索引的0项，则继续显示下一个问题
				eg:['0/0,3/#'] //  第一个问题选择第一个选项后，显示第三个问题，不会再向下一个问题延伸


		qa.question // 指定疾病下的问题文字 [必填]
		qa.answersType // 回答问题答案的类型（answersType 变量）[必填]
		qa.answersArr // 回答问题自定义答案（在填写改字段的时候，answersType必须为null）[非必填]
		qa.answerWord // 其他答案的文字[必填]
		qa.otherAnswer // 是否有其他答案[必填]

 * */
var diseaseData = [{
		dName: '超重或肥胖，三高', // 疾病大类
		children: [{
				dName: '高血压', // 疾病小类
				jubao: ['0/1', '1/1', '2/1'], // 1是 0否 -1 不清楚
				hebao: [], // 是否核保
				chuze: ['2/0'], // 是否除责
				note: '除外：心脑血管疾病及其并发症和后遗症', // 除责话术
				// 举个栗子：'索引/是或否的索引,索引/#(# 代表 强制结束)'
				questionStep: [
					'0/0,1/0,2/#'
				],
				qa: [{
					question: '是否诊断为继发性高血压（即导致高血压的原因已查明是以下疾病之一：急慢性肾小球肾炎、慢性肾盂肾炎、糖尿病肾病、多囊肾、肾动脉狭窄、嗜铬细胞瘤、原发性醛固酮增多症、肾上腺皮质醇增多症或其他疾病）？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false
				}, {
					question: '是否为2级及2级以上的高血压（收缩压≥160mmHg，或舒张压≥100mmHg）？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false
				}, {
					question: '是否伴有心/脑/肾疾病（包括视网膜病变、肾功能异常、蛋白尿、脑血管疾病、糖尿病、高脂/高胆固醇血症、心室肥厚、心肌缺血、心房颤动或其他心律失常）？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false
				}],

			},
			{
				dName: '糖尿病',
				jubao: ['0/0', '0/1'],
				hebao: [],
				note: '',
				chuze: [],
				questionStep: [],
				qa: [{
					question: '糖尿病',
					answersType: 2,
					answerWord: '',
					otherAnswer: false,
				}]
			},
			{
				dName: '高血糖、糖耐量异常、空腹血糖受损',
				jubao: ['0/1', '1/0', '1/-1'],
				hebao: [],
				note: '血糖异常、糖尿病及其并发症和后遗症',
				chuze: ['1/1'],
				questionStep: [
					'0/0,1/#'
				],
				qa: [{
					question: '是否伴有高血压、肥胖（即BMI＞29）？（注：BMI=体重kg/身高m²）',
					answersType: 0,
					answerWord: '',
					otherAnswer: false
				}, {
					question: '是否为短时间、一次性的高血糖，目前空腹血糖及糖化血红蛋白正常？',
					answersType: 0,
					answerWord: '不清楚',
					otherAnswer: true
				}],
			},
			{
				dName: '血糖高于正常值(6.1mmol/L)、尿糖阳性（未查血糖）',
				jubao: ['0/1', '1/0', '1/-1'],
				hebao: [],
				note: '血糖异常、糖尿病及其并发症和后遗症',
				chuze: ['1/1'],
				questionStep: [
					'0/0,1/#'
				],
				qa: [{
					question: '是否伴有高血压、肥胖（即BMI＞29）？（注：BMI=体重kg/身高m²）',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否为短时间、一次性的高血糖，目前空腹血糖及糖化血红蛋白正常？',
					answersType: 0,
					answerWord: '不清楚',
					otherAnswer: true
				}],
			},
			{
				dName: '超重或肥胖',
				jubao: ['0/1', '1/1', '2/0'],
				hebao: ['2/1'],
				note: '血糖异常、糖尿病及其并发症和后遗症',
				chuze: [],
				questionStep: [
					'0/0,1/0,2/#'
				],
				qa: [{
					question: '是否伴有空腹血糖升高、尿糖阳性、糖尿病、高血压、心脑血管疾病或重度脂肪肝？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '超重或肥胖正在治疗（服用降脂药或祛脂手术未超过1年）？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '超重或肥胖BMI（即体重指数=体重/身高²）小于或等于29kg/m²。',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}]
			},
			{
				dName: '高血脂',
				jubao: ['0/1', '3/0'],
				hebao: ['2/1'],
				note: '血糖异常、糖尿病及其并发症和后遗症',
				chuze: ['2/0', '2/-1'],
				questionStep: [
					'0/0,1/1,2/#',
					'0/0,1/0,3/#'
				],
				qa: [{
					question: '是否伴有高血压、肥胖（即BMI＞29）、糖尿病、心绞痛、心肌梗死、心房颤动、脑出血、脑血栓形成、脑梗死、短暂脑缺血发作？（注：BMI=体重kg/身高m²）',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '目前是否服用或曾经服用降脂药？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '半年内血脂检查是否正常？',
					answersType: 0,
					answerWord: '未检查',
					otherAnswer: true,
				}, {
					question: '半年内血脂检查是否正常？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}]
			}
		]
	},



	{
		dName: '骨骼，关节，肌肉疾病',
		children: [{
				dName: '强直性脊柱炎，肌无力',
				jubao: ['0/0', '0/1'],
				hebao: [],
				note: '',
				chuze: [],
				questionStep: [],
				qa: [{
					question: '强直性脊柱炎，肌无力',
					answersType: 2,
					answerWord: '',
					otherAnswer: false,
				}]
			},
			{
				dName: '颈椎病',
				jubao: ['1/0', '3/1'],
				hebao: ['2/1'],
				note: '除外：颈椎病及其并发症和后遗症',
				chuze: ['2/0', '3/0'],
				questionStep: ['0/1,1/1,2/#', '0/0,3/#'],
				qa: [{
					question: '是否已手术治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '手术治愈，至今未复发？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '手术后已超过2年以上，且无后遗症？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否多次发作，或医生建议进行手术治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ]
			},
			{
				dName: '肩周炎',
				jubao: ['0/1'],
				hebao: ['1/1'],
				note: '除外：肩周炎、肩部疾病及其并发症和后遗症',
				chuze: ['1/0'],
				questionStep: ['0/0,1/#'],
				qa: [{
					question: '是否为肩部以外的病症（如颈椎病、风湿病、关节炎或心、肺、胆道疾病等）引起的？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '肩周炎最近一次发病已超过1年以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}]
			},
			{
				dName: '腰间盘突出症（腰突症）',
				jubao: ['0/1', '1/1'],
				hebao: ['2/1'],
				note: '除外：腰间盘疾病、腰扭伤及其并发症和后遗症',
				chuze: ['2/0'],
				questionStep: ['0/0,1/0,2/#'],
				qa: [{
					question: '是否正在接受检查、治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否多次发作的腰间盘突出？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '单次发作的腰间盘突出，上次发病已超过2年以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ]
			},
			{
				dName: '关节脱位',
				jubao: ['0/1', '1/1'],
				hebao: ['2/1'],
				note: '除外：关节脱位及其并发症和后遗症',
				chuze: ['2/0'],
				questionStep: ['0/0,1/0,2/#'],
				qa: [{
					question: '是否正在接受检查、治疗或脊椎骨间脱位？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '同一关节发生2次或2次以上脱位？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '最近一次关节脱位已超过1年以上，且未遗留功能障碍？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ]
			},
			{
				dName: '骨质增生',
				jubao: ['0/1'],
				hebao: ['2/1'],
				note: '除外：骨质增生及其并发症和后遗症',
				chuze: ['1/0', '2/0'],
				questionStep: ['0/0,1/1,2/#'],
				qa: [{
					question: '是否伴有肢体麻木或感觉异常、大小便失禁或瘫痪？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '骨质增生已手术治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '术后已超过1年，未复发？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ]
			},
			{
				dName: '腰肌劳损',
				jubao: ['0/1'],
				hebao: ['1/1'],
				note: '除外：腰肌劳损及其并发症和后遗症',
				chuze: ['1/0'],
				questionStep: ['0/0,1/#'],
				qa: [{
					question: '是否伴有腰间盘突出症、脊柱畸形、骨质疏松、骨折？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '腰肌劳损发病次数未超过2次，且最近一次发病已超过1年？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ]
			},
			{
				dName: '痛风或高尿酸血症',
				jubao: ['0/1', '1/1'],
				hebao: ['2/1'],
				note: '除外：高尿酸血症、痛风及其并发症和后遗症',
				chuze: ['2/0'],
				questionStep: ['0/0,1/0,2/#'],
				qa: [{
					question: '是否病因明确（真性红细胞增多、淋巴瘤、白血病、使用利尿剂）？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '痛风是否伴有关节炎、关节变形、痛风性肾病或尿酸性肾病？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '发作频率≤1次/年，定期随诊，已超过1年未复发？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ]
			},
			{
				dName: '关节炎',
				jubao: ['0/1', '1/0'],
				hebao: ['2/1'],
				note: '除外：关节炎及其并发症和后遗症',
				chuze: ['2/0'],
				questionStep: ['0/0,1/1,2/#'],
				qa: [{
					question: '是否曾被诊断为风湿性关节炎、类风湿性关节炎、强直性脊柱炎或痛风性关节炎？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '累及关节数量不超过2个，没有关节变形或活动障碍，无需手术治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '最近一次发病已超过1年？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ]
			}
		]
	},
	{
		dName: '甲状腺疾病',
		children: [{
				dName: '甲状腺腺瘤',
				jubao: ['1/0', '1/-1', '2/0', '2/-1'],
				hebao: [],
				note: '除外：甲状腺疾病及其并发症和后遗症',
				chuze: ['1/1', '2/1'],
				questionStep: ['0/0,1/#', '0/1,2/#'],
				qa: [{
					question: '只一侧甲状腺有，还是两侧都曾有过？',
					answersType: 1,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否已经手术切除，而且手术后病理报告确诊为良性？',
					answersType: 0,
					answerWord: '不清楚',
					otherAnswer: true,
				}, {
					question: '是否两侧都已经手术切除，而且手术病理报告都确诊为良性？',
					answersType: 0,
					answerWord: '不清楚',
					otherAnswer: true,
				}, ]
			},
			{
				dName: '甲状腺手术史',
				jubao: ['0/2', '2/0', '4/0', '4/-1', '5/0', '5/-1'],
				hebao: ['3/1'],
				note: ['除外：甲状腺疾病及其并发症和后遗症', '除外：甲状腺疾病及其并发症和后遗症', ''],
				chuze: ['1/1', '3/0', '5/1', '6/1'],
				questionStep: [
					'0/0,1/0,2/1,3/#',
					'0/1,4/0,5/#',
					'0/1,4/1,6/#',
				],
				mixedQuestion: true,
				qa: [{
						question: '您的具体疾病是以下哪种？',
						answersType: null,
						answersArr: ['甲亢', '甲状腺腺瘤', '甲状腺癌、甲状腺占位/肿物（性质不明）、任何其它诊断，或不清楚诊断'],
						answerWord: '',
						otherAnswer: false,
					},

					// 甲亢问题 
					{
						question: '是否有甲状腺结节或肿块？',
						answersType: 0,
						answerWord: '',
						otherAnswer: false,
					}, {
						question: '是否已复查甲状腺功能，指标全部正常，而且已没有症状（如甲状腺肿大、突眼，心慌等）？',
						answersType: 0,
						answerWord: '',
						otherAnswer: false,
					}, {
						question: '治疗结束至今是否已满2年？',
						answersType: 0,
						answerWord: '',
						otherAnswer: false,
					},

					// 甲状腺腺瘤
					{
						question: '只一侧甲状腺有，还是两侧都曾有过？',
						answersType: 1,
						answerWord: '',
						otherAnswer: false,
					}, {
						question: '是否已经手术切除，而且手术后病理报告确诊为良性？',
						answersType: 0,
						answerWord: '不清楚',
						otherAnswer: true,
					}, {
						question: '是否两侧都已经手术切除，而且手术病理报告都确诊为良性？',
						answersType: 0,
						answerWord: '不清楚',
						otherAnswer: true,
					},
				]
			},
			{
				dName: '甲状腺结节',
				jubao: ['3/0'],
				hebao: ['1/1'],
				note: '除外：甲状腺疾病及其并发症和后遗症',
				chuze: ['1/0', '2/1', '3/1'],
				questionStep: ['0/1,1/#', '0/0,2/0,3/#'],
				qa: [{
					question: '“甲状腺结节”是否经医院进一步检查、治疗，穿刺活检或术后病理排查已排除恶性病变？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否已手术切除结节且治愈超1年以上，术后病理检查结果为良性，无相关后遗症且甲状腺B超、甲状腺功能检查均正常？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '“甲状腺结节”已发现2年以上，结节直径小于0.5cm，无症状，发现至今至少每年复查一次甲状腺B超且未见结节增大？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '“甲状腺结节”发现时间1-2年、结节直径0.5-1cm、无症状，且发现至今结节无增大？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ]
			},
			{
				dName: '甲状腺功能亢进（甲亢）',
				jubao: ['1/0'],
				hebao: ['2/1'],
				note: '除外：甲状腺疾病及其并发症和后遗症',
				chuze: ['0/1', '2/0'],
				questionStep: ['0/0,1/1,2/#'],
				qa: [{
					question: '是否有甲状腺结节或肿块？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否已复查甲状腺功能，指标全部正常，而且已没有症状（如甲状腺肿大、突眼，心慌等）？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '治疗结束至今是否已满2年？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ]
			},
			{
				dName: '甲状腺功能减退（甲减）',
				jubao: ['0/1', '1/1', '2/0'],
				hebao: [],
				note: '除外：甲状腺疾病及其并发症和后遗症',
				chuze: ['2/1'],
				questionStep: ['0/0,1/0,2/#'],
				qa: [{
					question: '是否是先天性甲减？或继发于手术、放射、肿瘤、垂体疾病？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否存在以下任一并发症：高血压、心脏肥大、痴呆、高脂血症、粘液水肿？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否长期服药、定期监测甲状腺功能，1年内甲状腺功能（T3/T4/FT3/FT4/TSH)正常？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ]
			}
		]
	},
	{
		dName: '良，恶性肿瘤',
		children: [{
				dName: '癌症、白血病、淋巴瘤等各种恶性肿瘤',
				jubao: ['0/0', '0/1'],
				hebao: [],
				note: '',
				chuze: [],
				questionStep: [],
				qa: [{
					question: '癌症、白血病、淋巴瘤等各种恶性肿瘤',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}]
			},
			{
				dName: '未明确性质的肿块、结节、息肉、囊肿或占位',
				jubao: ['0/0', '0/1'],
				hebao: [],
				note: '',
				chuze: [],
				questionStep: [],
				qa: [{
					question: '未明确性质的肿块、结节、息肉、囊肿或占位',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}]
			},
			{
				dName: '血管瘤/血管畸形',
				jubao: ['0/1', '1/1'],
				hebao: ['2/1'],
				note: '除外：原有部位的血管瘤/血管畸形及其并发症和后遗症',
				chuze: ['2/0'],
				questionStep: ['0/0,1/0,2/#'],
				qa: [{
					question: '是否正在接受检查、治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '血管瘤、血管畸形是否位于脑部、颈动脉、主动脉、心脏、肝脏、肾脏？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '手术治疗距今已超过1年，且近1年内未再就诊及检查结果均正常？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ]
			},
			{
				dName: '脂肪瘤',
				jubao: ['0/1', '1/1'],
				hebao: ['2/1'],
				note: '除外：原有部位的脂肪瘤/纤维脂肪瘤及其并发症和后遗症',
				chuze: ['2/0'],
				questionStep: ['0/0,1/0,2/#'],
				qa: [{
					question: '是否正在接受检查、治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否诊断为恶性脂肪瘤/恶性纤维脂肪瘤？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '手术切除距今已超过1年，术后病理检查结果为良性，且近1年内未再就诊及检查结果均正常？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ]
			},
			{
				dName: '良性肿瘤',
				jubao: ['0/1', '1/1'],
				hebao: ['2/1'],
				note: '除外：原有部位的肿瘤及其并发症和后遗症',
				chuze: ['2/0'],
				questionStep: ['0/0,1/0,2/#'],
				qa: [{
					question: '是否正在接受检查、治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '良性肿瘤是否位于颅内（脑瘤、垂体瘤、脑膜瘤，脑胶质瘤）、内分泌腺（甲状腺瘤、甲状旁腺瘤、肾上腺瘤）或纵膈（纵膈瘤、胸腺瘤）？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否手术切除1年以上，无压迫周围组织，不伴机能障碍？（如恶变，请选择“恶性肿瘤”问卷进行回答）',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ]
			}
		]
	},
	{
		dName: '脑部，精神疾病',
		children: [{
				dName: '脑炎',
				jubao: ['0/1', '1/0'],
				hebao: ['1/1'],
				note: '',
				chuze: [],
				questionStep: ['0/0,1/#'],
				qa: [{
					question: '是否正在接受检查、治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否痊愈至今已超过6个月，且无任何后遗症？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}]
			},
			{
				dName: '脑膜炎',
				jubao: ['0/1', '1/1', '2/0'],
				hebao: ['1/1'],
				note: '',
				chuze: [],
				questionStep: ['0/0,1/0,2/#'],
				qa: [{
					question: '是否是结核性脑膜炎？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否正在接受检查、治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否痊愈至今已超过6个月，且无任何后遗症？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}]
			},
			{
				dName: '中风',
				jubao: ['0/0'],
				hebao: [],
				note: '',
				chuze: [],
				questionStep: [],
				qa: [{
					question: '中风',
					answersType: 3,
					answerWord: '',
					otherAnswer: false,
				}]
			},
			{
				dName: '脑出血',
				jubao: ['0/0'],
				hebao: [],
				note: '',
				chuze: [],
				questionStep: [],
				qa: [{
					question: '脑出血',
					answersType: 3,
					answerWord: '',
					otherAnswer: false,
				}]
			},
			{
				dName: '脑梗塞',
				jubao: ['0/0'],
				hebao: [],
				note: '',
				chuze: [],
				questionStep: [],
				qa: [{
					question: '脑梗塞',
					answersType: 3,
					answerWord: '',
					otherAnswer: false,
				}]
			},
			{
				dName: '脑栓塞',
				jubao: ['0/0'],
				hebao: [],
				note: '',
				chuze: [],
				questionStep: [],
				qa: [{
					question: '脑栓塞',
					answersType: 3,
					answerWord: '',
					otherAnswer: false,
				}]
			},
			{
				dName: '蛛网膜下腔出血',
				jubao: ['0/0'],
				hebao: [],
				note: '',
				chuze: [],
				questionStep: [],
				qa: [{
					question: '蛛网膜下腔出血',
					answersType: 3,
					answerWord: '',
					otherAnswer: false,
				}]
			},
			{
				dName: '脑垂体疾病',
				jubao: ['0/0'],
				hebao: [],
				note: '',
				chuze: [],
				questionStep: [],
				qa: [{
					question: '脑垂体疾病',
					answersType: 3,
					answerWord: '',
					otherAnswer: false,
				}]
			},
			{
				dName: '帕金森氏症',
				jubao: ['0/0'],
				hebao: [],
				note: '',
				chuze: [],
				questionStep: [],
				qa: [{
					question: '帕金森氏症',
					answersType: 3,
					answerWord: '',
					otherAnswer: false,
				}]
			},
			{
				dName: '脑动静脉畸形',
				jubao: ['0/0'],
				hebao: [],
				note: '',
				chuze: [],
				questionStep: [],
				qa: [{
					question: '脑动静脉畸形',
					answersType: 3,
					answerWord: '',
					otherAnswer: false,
				}]
			},
			{
				dName: '癫痫',
				jubao: ['0/0'],
				hebao: [],
				note: '',
				chuze: [],
				questionStep: [],
				qa: [{
					question: '癫痫',
					answersType: 3,
					answerWord: '',
					otherAnswer: false,
				}]
			},
			{
				dName: '不明原因头痛',
				jubao: ['0/0'],
				hebao: [],
				note: '',
				chuze: [],
				questionStep: [],
				qa: [{
					question: '不明原因头痛',
					answersType: 3,
					answerWord: '',
					otherAnswer: false,
				}]
			},
			{
				dName: '精神疾病',
				jubao: ['0/0'],
				hebao: [],
				note: '',
				chuze: [],
				questionStep: [],
				qa: [{
					question: '精神疾病',
					answersType: 3,
					answerWord: '',
					otherAnswer: false,
				}]
			},
			{
				dName: '阿尔茨海默病（老年痴呆）',
				jubao: ['0/0'],
				hebao: [],
				note: '',
				chuze: [],
				questionStep: [],
				qa: [{
					question: '阿尔茨海默病（老年痴呆）',
					answersType: 3,
					answerWord: '',
					otherAnswer: false,
				}]
			}
		]
	},
	{
		dName: '皮肤疾病',
		children: [{
				dName: '银屑病（俗称“牛皮癣”）',
				jubao: ['0/0'],
				hebao: [],
				note: '',
				chuze: [],
				questionStep: [],
				qa: [{
					question: '银屑病（俗称“牛皮癣”）',
					answersType: 3,
					answerWord: '',
					otherAnswer: false,
				}]
			},
			{
				dName: '痤疮',
				jubao: [],
				hebao: ['0/0'],
				note: '除外：痤疮及其并发症和后遗症',
				chuze: ['0/1'],
				questionStep: [],
				qa: [{
					question: '是否发病中或正在接受检查、治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}]
			},
			{
				dName: '皮炎',
				jubao: ['0/1'],
				hebao: ['2/1', '3/1'],
				note: '除外：皮炎及其并发症和后遗症',
				chuze: ['2/0', '3/0'],
				questionStep: ['0/0,1/1,2/#', '0/0,1/0,3/#'],
				qa: [{
					question: '是否为银屑病（牛皮癣）/白癜风/系统性红斑狼疮？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否为单次发作的皮炎（病因明确，如接触性、过敏性、脂溢性）？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '已痊愈3个月以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '已痊愈1年以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ]
			},
			{
				dName: '皮肤过敏',
				jubao: ['1/0'],
				hebao: ['2/1'],
				note: '除外：皮肤过敏、原发病及其并发症和后遗症',
				chuze: ['1/1', '2/0'],
				questionStep: ['0/1,1/#', '0/0,2/#'],
				qa: [{
					question: '是否发病中或正在接受检查、治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '皮肤过敏是否为局部皮肤过敏（如颈部、前胸、后背部），且未出现全身症状或肾脏损害？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '皮肤过敏已痊愈3个月以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ]
			},
			{
				dName: '皮下囊肿',
				jubao: [],
				hebao: ['1/1'],
				note: '除外：皮下囊肿及其并发症和后遗症',
				chuze: ['0/0', '1/0'],
				questionStep: ['0/1,1/#'],
				qa: [{
					question: '是否已手术治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '皮下囊肿手术是否已超过6个月，且没有复发？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ]
			},
			{
				dName: '皮脂（腺）囊肿',
				jubao: [],
				hebao: ['1/1'],
				note: '除外：皮脂（腺）囊肿及其并发症和后遗症',
				chuze: ['0/0', '1/0'],
				questionStep: ['0/1,1/#'],
				qa: [{
					question: '是否已手术治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '皮脂（腺）囊肿手术是否已超过6个月，且没有复发？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ]
			},
			{
				dName: '荨麻疹',
				jubao: [],
				hebao: ['1/1'],
				note: '除外：荨麻疹及其并发症和后遗症',
				chuze: ['0/1', '1/0'],
				questionStep: ['0/0,1/#'],
				qa: [{
					question: '是否发病中或正在接受检查、治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否为局部荨麻疹，且已痊愈6个月以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ]
			},
			{
				dName: '湿疹',
				jubao: [],
				hebao: ['1/1'],
				note: '除外：湿疹及其并发症和后遗症',
				chuze: ['0/1', '1/0'],
				questionStep: ['0/0,1/#'],
				qa: [{
					question: '是否发病中或正在接受检查、治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '湿疹范围是否限于身体局部（如耳、手、足部等），且已痊愈3个月以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ]
			},
			{
				dName: '皮肤癣',
				jubao: ['0/1'],
				hebao: ['2/1', '3/1'],
				note: '除外：皮癣及其并发症和后遗症',
				chuze: ['2/0', '3/0'],
				questionStep: ['0/0,1/1,2/#', '0/0,1/0,3/#'],
				qa: [{
					question: '是否为银屑病（俗称“牛皮癣”）？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否为局部性皮癣？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '已痊愈6个月以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '已痊愈1年以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ]
			},
			{
				dName: '烧伤、烫伤',
				jubao: ['0/1', '1/0'],
				hebao: [],
				note: '除外：原有烧/烫伤后瘢痕增生，瘢痕挛缩及其并发症和后遗症',
				chuze: ['1/1'],
				questionStep: ['0/0,1/#'],
				qa: [{
					question: '是否符合以下任意一项：（1）是否烧伤总面积30%以上，或深Ⅱ度30%以上，或Ⅲ°烧伤面积10%以上；（2）烧伤已发生休克、呼吸道损伤、角膜损伤、全身性感染、心功能和肾功能不全、肺水肿、肺不张等并发症？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否已痊愈超过一年，无需后续治疗，无后遗症（肢体萎缩、功能受限），无精神或心理障碍？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ]
			}
		]
	},
	{
		dName: '气管，支气管，肺部疾病',
		children: [{
			dName: '气管炎，支气管炎',
			jubao: ['0/1', '1/1'],
			hebao: ['2/1'],
			note: '除外：呼吸系统感染性疾病及其并发症和后遗症',
			chuze: ['2/0'],
			questionStep: ['0/0,1/0,2/#'],
			qa: [{
				question: '是否曾被医生诊断为慢性支气管炎、肺气肿、慢性阻塞性肺病、支气管扩张、肺结核、肺癌？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '在最近5年中，因气管炎、支气管炎或肺炎住院是否超过2次？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否已经痊愈，而且最近6个月内未曾因呼吸道疾病（普通感冒除外）而就诊？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ]
		}, {
			dName: '肺炎',
			jubao: ['0/1', '1/1'],
			hebao: ['2/1'],
			note: '除外：呼吸系统感染性疾病及其并发症和后遗症',
			chuze: ['2/0'],
			questionStep: ['0/0,1/0,2/#'],
			qa: [{
				question: '是否曾被医生诊断有肺气肿、慢性阻塞性肺病、支气管扩张、肺结核或肺癌？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '最近5年中，因气管炎、支气管炎或肺炎住院是否超过2次？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否已经痊愈，而且最近6个月内未曾因呼吸道疾病（普通感冒除外）而就诊？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ]
		}, {
			dName: '肺结核',
			jubao: ['0/1', '1/0'],
			hebao: ['2/1'],
			note: '除外：结核病及其并发症和后遗症',
			chuze: ['2/0', '2/-1'],
			questionStep: ['0/0,1/1,2/#'],
			qa: [{
				question: '除了最近的一次，以前是否也曾有过，或曾有过肺外结核（如淋巴结核、结核性脑膜炎、结核性胸膜炎、结核性腹膜炎等）？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否治疗超过6个月？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '治疗结束至今是否已满2年，而且复查胸部X线（或CT）正常？',
				answersType: 0,
				answerWord: '不清楚',
				otherAnswer: true,
			}, ]
		}, {
			dName: '哮喘',
			jubao: ['0/1'],
			hebao: ['1/1'],
			note: '除外：哮喘及其并发症和后遗症',
			chuze: ['1/0'],
			questionStep: ['0/0,1/#'],
			qa: [{
				question: '诊断哮喘是年龄是否为0-3周岁，诊断至今未满1年，被诊断为中度哮喘，或者目前仍在治疗中？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '治疗已结束，且近1年内未再发作？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ]
		}, {
			dName: '胸膜炎',
			jubao: ['0/1', '1/1'],
			hebao: ['2/1'],
			note: '除外：胸膜炎及其并发症和后遗症',
			chuze: ['2/0'],
			questionStep: ['0/0,1/0,2/#'],
			qa: [{
				question: '最近半年内胸部X线检查是否显示仍有胸膜渗液征象，需进行检测，或治疗仍未结束（例如抗生素、可的松治疗、手术等）？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '引起胸膜炎的病因是否为癌症（如肺癌）、结核、系统性红斑狼疮或诊断不明？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '痊愈至今是否已超过半年？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ]
		}, {
			dName: '气胸',
			jubao: ['0/1', '1/1', '2/1'],
			hebao: [],
			note: '除外：气胸、气胸的原发病及其并发症和后遗症',
			chuze: ['2/0'],
			questionStep: ['0/0,1/0,2/#'],
			qa: [{
				question: '除了这一次，以前是否也曾有过气胸？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '治疗结束至今未满6个月或预期将进行外科手术治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '此次气胸的病因是否为支气管癌、肺癌或肺气肿？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ]
		}, {
			dName: '支气管扩张',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '支气管扩张',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}]
		}, {
			dName: '胸腔积液',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '胸腔积液',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}]
		}, {
			dName: '尘肺病（矽肺等）',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '尘肺病（矽肺等）',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}]
		}, {
			dName: '肺气肿',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '肺气肿',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}]
		}, {
			dName: '肺源性心脏病（肺心病）',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '肺源性心脏病（肺心病）',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}]
		}]
	},
	{
		dName: '器官移植',
		children: [{
			dName: '各种移植治疗（例如肾移植、骨髓移植、造血干细胞移植等）',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '各种移植治疗（例如肾移植、骨髓移植、造血干细胞移植等）',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}]
		}]
	},
	{
		dName: '乳腺，妇科疾病',
		children: [{
				dName: '乳腺纤维瘤',
				jubao: ['0/0', '1/0', '2/1'],
				hebao: ['2/0'],
				note: '',
				chuze: [],
				questionStep: ['0/1,1/1,2/#'],
				qa: [{
					question: '是否已经手术切除且手术至今已超过1年？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否保留了双侧乳房，手术后确诊为良性？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '手术后至今是否再次发现过乳房结节或肿块？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ],
			}, {
				dName: '乳腺手术（病理良性，囊肿、乳头状瘤、导管扩张症等）',
				jubao: [],
				hebao: ['0/1'],
				note: '除外：乳腺疾病及其并发症和后遗症',
				chuze: ['0/0'],
				questionStep: [],
				qa: [{
					question: '痊愈至今是否已满1年以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}],
			}, {
				dName: '乳腺手术（病理恶性、癌或不清楚诊断）',
				jubao: ['0/0'],
				hebao: [],
				note: '',
				chuze: [],
				questionStep: [],
				qa: [{
					question: '乳腺手术（病理恶性、癌或不清楚诊断）',
					answersType: 3,
					answerWord: '',
					otherAnswer: false,
				}],
			}, {
				dName: '卵巢囊肿，巧克力囊肿',
				jubao: ['0/0', '1/0'],
				hebao: ['1/1'],
				note: '',
				chuze: [],
				questionStep: ['0/1,1/#'],
				qa: [{
					question: '是否已手术切除？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '术后诊断结果是否为良性且痊愈1年以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ],
			}, {
				dName: '输卵管手术',
				jubao: [],
				hebao: ['0/1'],
				note: '除外：输卵管疾病及其并发症和后遗症',
				chuze: ['0/0'],
				questionStep: [],
				qa: [{
					question: '是否已痊愈超过1年？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}],
			}, {
				dName: '宫外孕',
				jubao: [],
				hebao: ['0/1'],
				note: '除外：宫外孕及其并发症和后遗症',
				chuze: ['0/0'],
				questionStep: [],
				qa: [{
					question: '是否已经手术治疗，仅单次发病，且术后痊愈至今已达6个月以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}],
			}, {
				dName: '子宫内膜异位',
				jubao: [],
				hebao: ['0/1'],
				note: '除外：子宫内膜异位症及其并发症和后遗症',
				chuze: ['0/0'],
				questionStep: [],
				qa: [{
					question: '是否已痊愈超过1年？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}],
			}, {
				dName: '子宫腺肌症',
				jubao: [],
				hebao: ['0/1'],
				note: '除外：子宫腺肌症及其并发症和后遗症',
				chuze: ['0/0'],
				questionStep: [],
				qa: [{
					question: '是否已手术，且术后痊愈已达1年以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}],
			}, {
				dName: '子宫肌瘤',
				jubao: [],
				hebao: ['0/1'],
				note: '除外：子宫肌瘤及其并发症和后遗症',
				chuze: ['0/0'],
				questionStep: [],
				qa: [{
					question: '是否已手术治疗（子宫肌瘤剔除术或子宫切除术），术后病理诊断结果为良性，且术后痊愈至今已达6个月以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}],
			}, {
				dName: '宫颈炎',
				jubao: ['0/1'],
				hebao: ['2/0'],
				note: '除外：宫颈疾病及其并发症和后遗症',
				chuze: ['1/1', '2/1'],
				questionStep: ['0/0,1/0,2/#'],
				qa: [{
					question: '是否曾被诊断为中度宫颈糜烂、宫颈上皮内瘤变（CIN）或人类乳头瘤病毒（HPV）检测阳性？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否接受过手术治疗，或是被医生建议接受手术治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否被医生建议治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ],
			}, {
				dName: '阴道炎',
				jubao: [],
				hebao: ['0/1'],
				note: '除外：阴道炎及其并发症和后遗症',
				chuze: ['0/0'],
				questionStep: [],
				qa: [{
					question: '是否已痊愈3个月以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}],
			}, {
				dName: '盆腔炎',
				jubao: [],
				hebao: ['2/1'],
				note: '除外：盆腔感染性疾病及其并发症和后遗症',
				chuze: ['0/1', '1/1', '2/0'],
				questionStep: ['0/0,1/0,2/#'],
				qa: [{
					question: '最近2年内是否曾住院治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '最近一年内是否因盆腔炎或其它妇科炎症（阴道炎等）就诊超过2次？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否已痊愈达3个月以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ],
			}, {
				dName: '月经失调',
				jubao: ['1/1'],
				hebao: ['2/0'],
				note: '除外：月经失调的原发病及其并发症和后遗症',
				chuze: ['0/0', '2/1'],
				questionStep: ['0/1,1/0,2/#'],
				qa: [{
					question: '是否曾去医院检查过？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否曾被医生诊断以下疾病：多囊卵巢综合征、卵巢肿瘤、垂体瘤或肾上腺疾病？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否被医生建议治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ],
			}, {
				dName: '怀孕',
				jubao: ['0/0', '1/1', '2/1'],
				hebao: ['2/0'],
				note: '',
				chuze: [],
				questionStep: ['0/1,1/0,2/#'],
				qa: [{
					question: '怀孕时年龄是否为18-40周岁？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否曾被诊断为高危妊娠（如多胎、妊娠期糖尿病、高血压、先兆子痫、子痫、肾脏疾病、胎盘/胎儿异常、凝血功能障碍、宫颈功能不全等），或曾被医生建议住院治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否已怀孕28周以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ],
			},
			{
				dName: '乳腺小叶增生',
				jubao: [],
				hebao: [],
				note: '除外：乳腺疾病及其并发症和后遗症',
				chuze: ['0/0'],
				questionStep: [],
				qa: [{
					question: '乳腺小叶增生',
					answersType: 3,
					answerWord: '',
					otherAnswer: false,
				}],
			}
		]
	},
	{
		dName: '肾，输尿管，膀胱，前列腺，尿道疾病',
		children: [{
			dName: '尿路感染',
			jubao: ['2/0'],
			hebao: ['1/1'],
			note: '除外：尿路感染及其并发症和后遗症',
			chuze: ['1/0', '2/1'],
			questionStep: ['0/1,1/#', '0/0,2/#'],
			qa: [{
				question: '仅发作一次且病因明确（肾盂、输尿管、膀胱、尿道的急性感染），并已治愈？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '手术至今已超过6个月？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '多次发作（2次及2次以上），且目前已治愈？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '肾结石',
			jubao: ['4/1'],
			hebao: ['1/1', '3/1'],
			note: '除外：泌尿系统结石及其并发症和后遗症',
			chuze: ['1/0', '3/0', '4/0'],
			questionStep: ['0/1,1/#', '0/0,2/1,3/#', '0/0,2/0,4/#'],
			qa: [{
				question: '是否已做手术或碎石治疗，且已治愈？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '最后一次发病至今已超过1年？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '肾结石自然排出或经门诊、住院治疗，已治愈？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '最后一次发病至今已超过1年？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否有如下情形之一：肾功能异常、尿路梗阻、尿潴留、肾积水、双侧或多发性尿路结石、痛风？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '输尿管结石',
			jubao: ['4/1'],
			hebao: ['1/1', '3/1'],
			note: '除外：泌尿系统结石及其并发症和后遗症',
			chuze: ['1/0', '3/0', '4/0'],
			questionStep: ['0/1,1/#', '0/0,2/1,3/#', '0/0,2/0,4/#'],
			qa: [{
				question: '是否已做手术或碎石治疗，且已治愈？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '最后一次发病至今已超过1年？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '肾结石自然排出或经门诊、住院治疗，已治愈？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '最后一次发病至今已超过1年？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否有如下情形之一：肾功能异常、尿路梗阻、尿潴留、肾积水、双侧或多发性尿路结石、痛风？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '膀胱结石',
			jubao: ['4/1'],
			hebao: ['1/1', '3/1'],
			note: '除外：泌尿系统结石及其并发症和后遗症',
			chuze: ['1/0', '3/0', '4/0'],
			questionStep: ['0/1,1/#', '0/0,2/1,3/#', '0/0,2/0,4/#'],
			qa: [{
				question: '是否已做手术或碎石治疗，且已治愈？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '最后一次发病至今已超过1年？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '肾结石自然排出或经门诊、住院治疗，已治愈？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '最后一次发病至今已超过1年？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否有如下情形之一：肾功能异常、尿路梗阻、尿潴留、肾积水、双侧或多发性尿路结石、痛风？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '肾囊肿',
			jubao: ['0/0'],
			hebao: ['2/1', '3/1'],
			note: '除外：肾囊肿及其并发症和后遗症',
			chuze: ['2/0', '3/0'],
			questionStep: ['0/1,1/1,2/#', '0/1,1/0,3/#'],
			qa: [{
				question: '是否为“单纯肾囊肿”（双肾合计囊肿不超过2个，且囊肿直径不超过2cm）？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否为体检发现，且无症状及肾功异常？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '已进行手术治疗，超过1年未复发？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '已进行手术治疗，超过2年未复发？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '尿路结石',
			jubao: ['0/3', '5/1', '10/1', '15/1'],
			hebao: ['2/1', '4/1', '7/1', '9/1', '12/1', '14/1'],
			note: ['除外：泌尿系统结石及其并发症和后遗症', '除外：泌尿系统结石及其并发症和后遗症', '除外：泌尿系统结石及其并发症和后遗症', ''],
			chuze: ['2/0', '4/0', '5/0', '7/0', '9/0', '10/0', '12/0', '14/0', '15/0'],
			questionStep: [
				'0/0,1/1,2/#',
				'0/0,3/1,4/#',
				'0/0,3/0,5/#',

				'0/1,6/1,7/#',
				'0/1,6/0,8/1,9/#',
				'0/1,8/0,10/#',

				'0/2,11/1,12/#',
				'0/2,13/0,14/#',
				'0/2,13/0,15/#'
			],
			mixedQuestion: true,
			qa: [
				// 1
				{
					question: '您的具体疾病是以下哪种？',
					answersType: null,
					answersArr: ['肾结石', '输尿管结石', '膀胱结石',
						'其它诊断（或合并肾功能异常、高血压、尿路梗阻、尿潴留、肾积水、痛风、或为双侧或多发性尿路结石）'
					],
					answerWord: '',
					otherAnswer: false,
				},
				// 肾结石 5
				{
					question: '是否已做手术或碎石治疗，且已治愈？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '最后一次发病至今已超过1年？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '肾结石自然排出或经门诊、住院治疗，已治愈？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '最后一次发病至今已超过1年？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否有如下情形之一：肾功能异常、尿路梗阻、尿潴留、肾积水、双侧或多发性尿路结石、痛风？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				},

				// 输尿管结石 5
				{
					question: '是否已做手术或碎石治疗，且已治愈？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '最后一次发病至今已超过1年？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '肾结石自然排出或经门诊、住院治疗，已治愈？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '最后一次发病至今已超过1年？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否有如下情形之一：肾功能异常、尿路梗阻、尿潴留、肾积水、双侧或多发性尿路结石、痛风？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				},

				// 膀胱结石 5
				{
					question: '是否已做手术或碎石治疗，且已治愈？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '最后一次发病至今已超过1年？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '肾结石自然排出或经门诊、住院治疗，已治愈？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '最后一次发病至今已超过1年？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否有如下情形之一：肾功能异常、尿路梗阻、尿潴留、肾积水、双侧或多发性尿路结石、痛风？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				},

			],
		}, {
			dName: '肾切除术',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '肾切除术',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '前列腺炎',
			jubao: [],
			hebao: ['2/1', '3/1'],
			note: '除外：前列腺炎及其并发症和后遗症',
			chuze: ['0/1', '2/0', '3/0'],
			questionStep: ['0/0,1/1,2/#', '0/0,1/0,3/#'],
			qa: [{
				question: '是否发病中或正在接受检查、治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否为急性前列腺炎，且已治愈？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '痊愈至今已达半年以上？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '痊愈至今已达1年以上？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '前列腺肥大，前列腺增生',
			jubao: ['2/0'],
			hebao: ['1/1'],
			note: '除外：前列腺肥大/增生及其并发症和后遗症',
			chuze: ['1/0', '2/1'],
			questionStep: ['0/1,1/0', '0/0,2/#'],
			qa: [{
				question: '是否已做手术治疗且治愈？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '手术至今已超过1年？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: 'PSA（前列腺特异性抗原）结果正常且无并发症（附睾炎、尿道炎、尿潴留、前列腺癌）？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '精索静脉曲张',
			jubao: [],
			hebao: ['1/1'],
			note: '除外：精索静脉曲张及其并发症和后遗症',
			chuze: ['0/0', '1/0'],
			questionStep: ['0/1,1/#'],
			qa: [{
				question: '是否已做手术治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '手术后至今是否已超过1年，且没有复发？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '肾炎，肾病，肾病综合征，多囊肾',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '肾炎，肾病，肾病综合征，多囊肾',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '肾功能不全，尿毒症，肾移植',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '肾功能不全，尿毒症，肾移植',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '血尿，蛋白尿，管型尿，浮肿',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '血尿，蛋白尿，管型尿，浮肿',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}],
		}]
	}, {
		dName: '外伤',
		children: [{
			dName: '表皮外伤',
			jubao: [],
			hebao: ['1/1'],
			note: '除外：原有部位的表皮外伤及其并发症和后遗症',
			chuze: ['0/1', '1/0'],
			questionStep: ['0/0,1/#'],
			qa: [{
				question: '是否正在接受检查、治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否已痊愈1个月以上？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '软组织挫伤',
			jubao: [],
			hebao: ['1/1'],
			note: '除外：原有部位的软组织挫伤及其并发症和后遗症',
			chuze: ['0/1', '1/0'],
			questionStep: ['0/0,1/#'],
			qa: [{
				question: '是否正在接受检查、治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '软组织挫伤是否已痊愈1个月以上？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '肌肉拉伤',
			jubao: [],
			hebao: ['1/1'],
			note: '除外：原有部位的肌肉拉伤及其并发症和后遗症',
			chuze: ['0/1', '1/0'],
			questionStep: ['0/0,1/#'],
			qa: [{
				question: '是否正在接受检查、治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '肌肉拉伤是否已痊愈6个月以上？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '骨折',
			jubao: ['0/1', '1/1'],
			hebao: ['2/1'],
			note: '除外：原有部位的骨折及其并发症和后遗症',
			chuze: ['2/0'],
			questionStep: ['0/0,1/0,2/#'],
			qa: [{
				question: '是否正在接受检查、治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '骨折部位是否为头颅，脊椎（颈椎、胸椎或腰椎），或股骨（骨头颈、股骨头），或有遗留功能障碍/并发症？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '骨折是否已取出内固定物（或无内固定物），且已痊愈1年以上？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '关节损伤',
			jubao: ['0/1', '1/1'],
			hebao: ['2/1'],
			note: '除外：原有部位的关节损伤及其并发症和后遗症',
			chuze: ['2/0'],
			questionStep: ['0/0,1/0,2/#'],
			qa: [{
				question: '是否正在接受检查、治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '关节损伤部位是否为大关节（踝关节、膝关节、髋关节、腕关节、肘关节、肩关节）或脊椎关节？或大于等于2个关节？或有功能障碍/并发症？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '关节损伤是否已痊愈1年以上？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '眼外伤',
			jubao: ['0/1', '1/1'],
			hebao: ['2/1'],
			note: '除外：眼外伤及其并发症和后遗症',
			chuze: ['2/0'],
			questionStep: ['0/0,1/0,2/#'],
			qa: [{
				question: '是否正在接受检查、治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '眼外伤是否引起视网膜损害、交感神经眼炎或视力丧失？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '眼外伤是否已痊愈1年以上？且无视力障碍？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '视网膜剥离',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '视网膜剥离',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '鼻外伤',
			jubao: ['0/1'],
			hebao: ['1/1'],
			note: '除外：鼻外伤及其并发症和后遗症',
			chuze: ['1/0'],
			questionStep: ['0/0,1/#'],
			qa: [{
				question: '是否正在接受检查、治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '鼻外伤是否已痊愈3个月以上，且无后遗症（鼻出血、鼻部畸形等）？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '脊柱外伤',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '脊柱外伤',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '头部外伤（除皮肤损伤外）',
			jubao: ['0/1', '1/1'],
			hebao: ['2/1'],
			note: '除外：头部外伤及其并发症和后遗症',
			chuze: ['2/0'],
			questionStep: ['0/0,1/0,2/#'],
			qa: [{
				question: '是否正在接受检查、治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否有昏迷史、癫痫并发症或其它脑外伤后遗症？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否已痊愈1年以上，且1年内头颅CT及脑电图检查结果均正常？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}]
	}, {
		dName: '消化系统疾病1（胃肠道疾病）',
		children: [{
			dName: '胃炎',
			jubao: ['2/0', '4/1', '6/1', '7/1'],
			hebao: ['3/1', '5/1', '7/0'],
			note: '除外：上消化道（食管、胃、十二指肠）炎症、溃疡及其并发症和后遗症',
			chuze: ['3/0', '5/0'],
			questionStep: ['0/1,1/1,2/1,3/#', '0/0,1/0,4/0,5/#', '0/0,6/0,7/#'],
			qa: [{
				question: '是否伴胃溃疡？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否手术治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '手术确诊为良性？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '手术后至今2年未发病（不需要服用抗酸、止痛及抗幽门螺旋杆菌等药物）？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否出现并发症（出血、穿孔、狭窄、癌变）或被医生建议手术治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '最后一次发病至今是否达2年以上？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否曾被医生诊断为“慢性萎缩性胃炎”，或是被医生建议做胃镜检查？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否曾有出血、穿孔、或被诊断为胃癌或可疑胃癌？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '胃溃疡',
			jubao: ['1/0', '3/1'],
			hebao: ['2/1', '4/1'],
			note: '除外：上消化道（食管、胃、十二指肠）炎症、溃疡及其并发症和后遗症',
			chuze: ['2/0', '4/0'],
			questionStep: ['0/1,1/1,2/#', '0/0,3/0,4/#'],
			qa: [{
				question: '是否手术治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '手术后确诊为良性？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '手术后至今2年未发病（不需要服用抗酸、止痛即抗幽门螺旋杆菌等药物）？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否出现并发症（出血、穿孔、狭窄、癌变）或被医生建议手术治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '最后一次发病至今是否达2年以上？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '十二指肠溃疡',
			jubao: [],
			hebao: ['1/1'],
			note: '除外：上消化道（食管、胃、十二指肠）炎症、溃疡及其并发症和后遗症',
			chuze: ['0/0', '1/0'],
			questionStep: ['0/1,1/#'],
			qa: [{
				question: '是否手术治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '术后至今2年未发病（不需要服用抗酸、止痛即抗幽门螺旋杆菌等药物）？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '胃肠炎',
			jubao: ['2/1'],
			hebao: ['1/1'],
			note: '除外：肠胃炎及其并发症和后遗症',
			chuze: ['1/0', '2/0'],
			questionStep: ['0/1,1/#', '0/0,2/#'],
			qa: [{
				question: '医生诊断是“急性胃肠炎”（急性、单次发作）？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '痊愈至今是否已超过1个月？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '医生诊断是“溃疡性结肠炎”，伴发溃疡、出血、梗阻，或建议做肠镜检查？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '肠炎',
			jubao: ['2/1'],
			hebao: ['1/1'],
			note: '除外：肠炎及其并发症和后遗症',
			chuze: ['1/0', '2/0'],
			questionStep: ['0/1,1/#', '0/0,2/#'],
			qa: [{
				question: '医生诊断是“急性肠炎”（急性、单次发作）？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '痊愈至今是否已超过1个月？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '医生诊断是溃疡性结肠炎，慢性肠炎，其它类型肠炎，或建议做肠镜检查？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '结肠炎',
			jubao: ['2/1'],
			hebao: ['1/1'],
			note: '除外：结肠炎及其并发症和后遗症',
			chuze: ['1/0', '2/0'],
			questionStep: ['0/1,1/#', '0/0,2/#'],
			qa: [{
				question: '医生诊断是“急性结肠炎”（急性、单次发作）？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '痊愈至今是否已超过3个月？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '医生诊断是溃疡性结肠炎，或建议做肠镜检查？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '阑尾炎',
			jubao: ['3/1'],
			hebao: ['1/1'],
			note: '除外：阑尾炎及其并发症和后遗症',
			chuze: ['1/0', '2/1', '3/0'],
			questionStep: ['0/1,1/#', '0/0,2/0,3/#'],
			qa: [{
				question: '是否已手术治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '手术至今已超过6个月，且无术后并发症（腹腔内出血、腹腔或盆腔脓肿、肠粘连或粘连性肠梗阻）？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否治疗中或被医生建议手术治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否出现并发症（如腹膜炎、脓肿、内瘘、外瘘、化脓性门静脉炎）？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '疝气',
			jubao: [],
			hebao: ['1/1'],
			note: '除外：疝气及其并发症和后遗症',
			chuze: ['0/0', '1/0'],
			questionStep: ['0/1,1/#'],
			qa: [{
				question: '是否已手术治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '手术至今已超过6个月，并且没有再复发？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '胃出血',
			jubao: ['0/3', '3/0', '5/1', '7/1', '8/1', '9/0', '12/1'],
			hebao: ['4/1', '6/1', '8/0', '11/1', '13/1', '15/1'],
			note: [
				'除外：上消化道（食管、胃、十二指肠）炎症、溃疡及其并发症和后遗症',
				'除外：上消化道（食管、胃、十二指肠）炎症、溃疡及其并发症和后遗症',
				'除外：上消化道（食管、胃、十二指肠）炎症、溃疡及其并发症和后遗症',
				''
			],
			chuze: ['4/0', '6/0', '11/0', '13/0', '14/0', '15/0'],
			mixedQuestion: true,
			questionStep: [
				'0/0,1/1,2/1,3/1,4/#',
				'0/0,1/0,2/0,5/0,6/#',
				'0/0,1/0,7/0,8/#',
				'0/1,9/1,10/1,11/#',
				'0/1,9/0,12/0,13/#',
				'0/2,14/0,15/#'
			],
			qa: [
				// 1
				{
					question: '您的具体疾病是以下哪种？',
					answersType: null,
					answersArr: ['胃炎', '胃溃疡', '十二指肠溃疡', '胃癌、肝硬化、其他诊断或诊断不明'],
					answerWord: '',
					otherAnswer: false,
				},
				// 胃炎 8
				{
					question: '是否伴胃溃疡？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否手术治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '手术确诊为良性？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '手术后至今2年未发病（不需要服用抗酸、止痛及抗幽门螺旋杆菌等药物）？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否出现并发症（出血、穿孔、狭窄、癌变）或被医生建议手术治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '最后一次发病至今是否达2年以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否曾被医生诊断为“慢性萎缩性胃炎”，或是被医生建议做胃镜检查？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否曾有出血、穿孔、或被诊断为胃癌或可疑胃癌？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				},
				// 胃溃疡 5
				{
					question: '是否手术治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '手术后确诊为良性？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '手术后至今2年未发病（不需要服用抗酸、止痛即抗幽门螺旋杆菌等药物）？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否出现并发症（出血、穿孔、狭窄、癌变）或被医生建议手术治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '最后一次发病至今是否达2年以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				},


				// 十二指肠溃疡 2
				{
					question: '是否手术治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '术后至今2年未发病（不需要服用抗酸、止痛即抗幽门螺旋杆菌等药物）？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				},
			],
		}, {
			dName: '胃穿孔',
			jubao: ['0/3', '3/0', '5/1', '7/1', '8/1', '9/0', '12/1'],
			hebao: ['4/1', '6/1', '8/0', '11/1', '13/1', '15/1'],
			note: [
				'除外：上消化道（食管、胃、十二指肠）炎症、溃疡及其并发症和后遗症',
				'除外：上消化道（食管、胃、十二指肠）炎症、溃疡及其并发症和后遗症',
				'除外：上消化道（食管、胃、十二指肠）炎症、溃疡及其并发症和后遗症',
				''
			],
			chuze: ['4/0', '6/0', '11/0', '13/0', '14/0', '15/0'],
			mixedQuestion: true,
			questionStep: [
				'0/0,1/1,2/1,3/1,4/#',
				'0/0,1/0,2/0,5/0,6/#',
				'0/0,1/0,7/0,8/#',
				'0/1,9/1,10/1,11/#',
				'0/1,9/0,12/0,13/#',
				'0/2,14/0,15/#'
			],
			qa: [
				// 1
				{
					question: '您的具体疾病是以下哪种？',
					answersType: null,
					answersArr: ['胃炎', '胃溃疡', '十二指肠溃疡', '胃癌、其他诊断或诊断不明'],
					answerWord: '',
					otherAnswer: false,
				},
				// 胃炎 8
				{
					question: '是否伴胃溃疡？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否手术治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '手术确诊为良性？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '手术后至今2年未发病（不需要服用抗酸、止痛及抗幽门螺旋杆菌等药物）？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否出现并发症（出血、穿孔、狭窄、癌变）或被医生建议手术治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '最后一次发病至今是否达2年以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否曾被医生诊断为“慢性萎缩性胃炎”，或是被医生建议做胃镜检查？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否曾有出血、穿孔、或被诊断为胃癌或可疑胃癌？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				},
				// 胃溃疡 5
				{
					question: '是否手术治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '手术后确诊为良性？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '手术后至今2年未发病（不需要服用抗酸、止痛即抗幽门螺旋杆菌等药物）？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否出现并发症（出血、穿孔、狭窄、癌变）或被医生建议手术治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '最后一次发病至今是否达2年以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				},


				// 十二指肠溃疡 2
				{
					question: '是否手术治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '术后至今2年未发病（不需要服用抗酸、止痛即抗幽门螺旋杆菌等药物）？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				},
			],
		}, {
			dName: '胃手术',
			jubao: ['0/2', '2/0', '4/1'],
			hebao: ['3/1', '5/1', '7/1'],
			note: [
				'除外：上消化道（食管、胃、十二指肠）炎症、溃疡及其并发症和后遗症',
				'除外：上消化道（食管、胃、十二指肠）炎症、溃疡及其并发症和后遗症',
				''
			],
			chuze: ['3/0', '5/0', '6/0', '7/0'],
			mixedQuestion: true,
			questionStep: [
				'0/0,1/1,2/1,3/#',
				'0/0,1/0,4/0,5/#',
				'0/1,6/0,7/#'
			],
			qa: [
				// 1
				{
					question: '您的具体疾病是以下哪种？',
					answersType: null,
					answersArr: ['胃溃疡', '十二指肠溃疡', '胃癌、其他诊断或诊断不明则拒保'],
					answerWord: '',
					otherAnswer: false,
				},

				// 胃溃疡 5
				{
					question: '是否手术治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '手术后确诊为良性？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '手术后至今2年未发病（不需要服用抗酸、止痛即抗幽门螺旋杆菌等药物）？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否出现并发症（出血、穿孔、狭窄、癌变）或被医生建议手术治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '最后一次发病至今是否达2年以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				},


				// 十二指肠溃疡 2
				{
					question: '是否手术治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '术后至今2年未发病（不需要服用抗酸、止痛即抗幽门螺旋杆菌等药物）？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				},

			],
		}, {
			dName: '溃疡性结肠炎',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '溃疡性结肠炎',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '肠梗阻，肠套叠',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '肠梗阻，肠套叠',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '胃肠道息肉',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '胃肠道息肉',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}],
		}]
	}, {
		dName: '消化系统疾病2（肝胆胰脾疾病）',
		children: [{
				dName: '脂肪肝',
				jubao: ['0/1', '2/1'],
				hebao: [],
				note: '除外：脂肪肝及其并发症和后遗症',
				chuze: ['1/0', '2/0'],
				questionStep: ['0/0,1/1,2/#'],
				qa: [{
					question: '是否曾被发现有肝功能异常，或高血压（140/90mmHg以上），或高血糖，或因脂肪肝住院治疗？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否饮用40度以上的酒类？（如白酒、威士忌、白兰地、伏特加等）',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '平均每周是否超过1次？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, ],
			}, {
				dName: '乙肝病毒携带或乙肝小三阳',
				jubao: ['0/0'],
				hebao: [],
				note: '除外：肝炎及其并发症和后遗症',
				chuze: ['0/1'],
				questionStep: [],
				qa: [{
					question: '是否乙肝表面抗原（HBsAg）阳性持续6个月以上，没有肝病症状，未被医生建议进一步诊断或治疗，且肝功正常？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}],
			}, {
				dName: '乙肝大三阳',
				jubao: ['0/0'],
				hebao: [],
				note: '',
				chuze: [],
				questionStep: [],
				qa: [{
					question: '乙肝大三阳',
					answersType: 3,
					answerWord: '',
					otherAnswer: false,
				}],
			}, {
				dName: '慢性活动性肝炎，爆发性肝炎，重症肝炎',
				jubao: ['0/0'],
				hebao: [],
				note: '',
				chuze: [],
				questionStep: [],
				qa: [{
					question: '慢性活动性肝炎，爆发性肝炎，重症肝炎',
					answersType: 3,
					answerWord: '',
					otherAnswer: false,
				}],
			}, {
				dName: '丙型肝炎，其他肝炎',
				jubao: ['0/0'],
				hebao: [],
				note: '',
				chuze: [],
				questionStep: [],
				qa: [{
					question: '丙型肝炎，其他肝炎',
					answersType: 3,
					answerWord: '',
					otherAnswer: false,
				}],
			}, {
				dName: '肝硬化，多囊肝，肝/脾肿大',
				jubao: ['0/0'],
				hebao: [],
				note: '',
				chuze: [],
				questionStep: [],
				qa: [{
					question: '肝硬化，多囊肝，肝/脾肿大',
					answersType: 3,
					answerWord: '',
					otherAnswer: false,
				}],
			}, {
				dName: '胆囊手术',
				jubao: ['3/0', '7/0'],
				hebao: ['3/1', '4/1', '5/1', '7/1'],
				note: [
					'除外：胆囊炎及其并发症和后遗症',
					'除外：胆结石及其并发症和后遗症',
					'除外：胆结石及其并发症和后遗症',
					''
				],
				chuze: ['4/0', '5/0', '6/0'],
				mixedQuestion: true,
				questionStep: [
					'0/0,1/0,3/0,4/#',
					'0/0,2/1,5/#', // 跳转到胆结石
					'0/0,2/-1,5/#', // 跳转到胆结石

					'0/1,5/#',

					'0/2,6/1,7/#'
				],
				qa: [
					// 1
					{
						question: '您的具体疾病是以下哪种？',
						answersType: null,
						answersArr: ['胆囊炎', '胆结石', '胆囊息肉', '任何其它诊断'],
						answerWord: '',
						otherAnswer: false,
					},
					// 胆囊炎 4
					{
						question: '是否有胆结石？',
						answersType: 0,
						answerWord: '不清楚',
						otherAnswer: true,
					}, {
						question: '胆结石',
						answersType: 0,
						answerWord: '不清楚',
						otherAnswer: true,
					}, {
						question: '是否已通过手术治愈（包括通过腹腔镜进行的胆囊切除手术）？',
						answersType: 0,
						answerWord: '',
						otherAnswer: false,
					}, {
						question: '最后一次发作距今是否已超过1年？',
						answersType: 0,
						answerWord: '',
						otherAnswer: false,
					},

					// 胆结石 1
					{
						question: '是否已通过手术治愈（包括通过腹腔镜进行的胆囊切除手术），且术后至今已达6个月以上？',
						answersType: 0,
						answerWord: '',
						otherAnswer: false,
					},


				],
			}, {
				dName: '胰腺炎',
				jubao: ['0/0'],
				hebao: [],
				note: '',
				chuze: [],
				questionStep: [],
				qa: [{
					question: '胰腺炎',
					answersType: 3,
					answerWord: '',
					otherAnswer: false,
				}],
			}, {
				dName: '甲型肝炎，戊型肝炎',
				jubao: ['0/0'],
				hebao: [],
				note: '',
				chuze: ['0/1'],
				questionStep: [],
				qa: [{
					question: '是否已痊愈6个月以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}],
			}, {
				dName: '肝囊肿',
				jubao: ['0/1', '1/1'],
				hebao: ['1/0'],
				note: '',
				chuze: [],
				questionStep: ['0/0,1/#'],
				qa: [{
					question: '是否有超过3个囊肿，或者曾被诊断多囊肝？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '是否有直径超过3cm的囊肿?',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}],
			},
			{
				dName: '胆囊炎',
				jubao: [],
				hebao: ['2/1', '3/1'],
				note: '除外：胆囊炎及其并发症和后遗症',
				chuze: ['3/0'],
				questionStep: ['0/0,2/0,3/#', '0/1'],
				qa: [{
					question: '是否有胆结石？',
					answersType: 0,
					answerWord: '不清楚',
					otherAnswer: true,
				}, {
					question: '胆结石',
					answersType: 0,
					answerWord: '不清楚',
					otherAnswer: true,
				}, {
					question: '是否已通过手术治愈（包括通过腹腔镜进行的胆囊切除手术）？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '最后一次发作距今是否已超过1年？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}],
			}, {
				dName: '胆结石',
				jubao: [],
				hebao: ['0/1'],
				note: '除外：胆结石及其并发症和后遗症',
				chuze: ['0/0'],
				questionStep: [],
				qa: [{
					question: '是否已通过手术治愈（包括通过腹腔镜进行的胆囊切除手术），且术后至今已达6个月以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}],
			},
			{
				dName: '胆囊息肉',
				jubao: ['1/0'],
				hebao: ['1/1'],
				note: '除外：胆囊疾病及其并发症和后遗症',
				chuze: ['0/0'],
				questionStep: ['0/1,1/#'],
				qa: [{
					question: '是否已手术切除胆囊？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}, {
					question: '术后病理诊断结果为良性，且已痊愈达6个月以上？',
					answersType: 0,
					answerWord: '',
					otherAnswer: false,
				}],
			}
		]
	}, {
		dName: '消化系统疾病3（肛周疾病）',
		children: [{
			dName: '痔疮',
			jubao: [],
			hebao: ['1/1', '2/1'],
			note: '除外：痔疮及其并发症和后遗症',
			chuze: ['1/0', '2/0'],
			questionStep: ['0/1,1/#', '0/0,2/#'],
			qa: [{
				question: '是否已手术治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '手术至今已超过6个月，且没有复发或并发症（直肠肛管周围脓肿、肛瘘）？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '最近一次发病至今已超1年，且未再复发？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '肛裂',
			jubao: [],
			hebao: ['1/1', '2/1'],
			note: '除外：肛管、肛周疾病及其并发症和后遗症',
			chuze: ['1/0', '2/0'],
			questionStep: ['0/1,1/#', '0/0,2/#'],
			qa: [{
				question: '是否已手术治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '手术至今已超过1年，术后病理为良性，并且没有再复发？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '最近一次发病至今已超1年？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '肛瘘',
			jubao: ['0/0'],
			hebao: ['2/1'],
			note: '除外：肛管、肛周疾病及其并发症和后遗症',
			chuze: ['1/0', '2/0'],
			questionStep: ['0/1,1/1,2/#'],
			qa: [{
				question: '是否为单纯性肛瘘（单纯性肛瘘为肛门直肠瘘或坐骨直肠瘘，但没有临床症状）？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否已做手术治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '手术后至今是否已超过6个月，并且没有再复发？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '肛周脓肿',
			jubao: [],
			hebao: ['1/1'],
			note: '除外：肛管、肛周疾病及其并发症和后遗症',
			chuze: ['0/0', '1/0'],
			questionStep: ['0/1,1/#'],
			qa: [{
				question: '是否已手术治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '手术至今已超过1年，并且没有再复发？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}],
		}]
	}, {
		dName: '性病，艾滋病，吸毒，酒精或药物滥用',
		children: [{
			dName: '性传播疾病（淋病、 梅毒、尖锐湿疣等）',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '性传播疾病（淋病、 梅毒、尖锐湿疣等）',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '艾滋病、HIV感染或携带',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '艾滋病、HIV感染或携带',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '吸毒、酒精或药物滥用',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '吸毒、酒精或药物滥用',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}],
		}]
	}, {
		dName: '血管、心血管',
		children: [{
			dName: '心肌炎，早搏等心律失常，心电图异常',
			jubao: ['0/1', '1/0'],
			hebao: ['2/1'],
			note: '除外：心脏疾病及其并发症和后遗症',
			chuze: ['2/0'],
			questionStep: ['0/0,1/1,2/#'],
			qa: [{
				question: '是否正在接受检查、治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '心肌炎已痊愈超过6个月，无早搏等心律失常，无心电图异常？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '心肌炎是否已超过1年？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '下肢静脉曲张',
			jubao: ['0/1'],
			hebao: ['2/1'],
			note: '除外：外周血管疾病及其并发症和后遗症',
			chuze: ['1/0', '2/0'],
			questionStep: ['0/0,1/1,2/#'],
			qa: [{
				question: '是否正在接受检查、治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '下肢静脉曲张已进行手术治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '手术距今已超过1年，且未复发？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '冠心病、心肌缺血，心绞痛，心肌梗塞',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '冠心病、心肌缺血，心绞痛，心肌梗塞',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '先天性心脏病、心脏瓣膜缺损/狭窄/关闭不全',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '先天性心脏病、心脏瓣膜缺损/狭窄/关闭不全',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '风湿性心脏病，心肌病',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '风湿性心脏病，心肌病',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '心功能不全',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '心功能不全',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '心脏手术，安装起搏器，动脉瘤',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '心脏手术，安装起搏器，动脉瘤',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}],
		}]
	}, {
		dName: '血液，淋巴，结缔组织和免疫系统疾病',
		children: [{
			dName: '淋巴结炎',
			jubao: ['0/1'],
			hebao: ['1/1'],
			note: '除外：淋巴结炎/肿大、原发病及其并发症和后遗症',
			chuze: ['1/0'],
			questionStep: ['0/0,1/#'],
			qa: [{
				question: '是否诊断为淋巴瘤、白血病、系统性红斑狼疮（SLE）、钩端螺旋体病、传染性单核细胞增多症、艾滋病？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '淋巴结炎/肿大，是否已痊愈6个月以上？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '贫血',
			jubao: ['0/1', '1/1', '2/0'],
			hebao: [],
			note: '除外：贫血、原发病及其并发症和后遗症',
			chuze: ['2/1'],
			questionStep: ['0/0,1/0,2/#'],
			qa: [{
				question: '是否正在接受检查、治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否诊断为白血病、再生障碍性贫血、骨髓增生异常综合征、血友病或恶性肿瘤？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否仅为轻度贫血，且贫血程度稳定时间超过6个月？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '紫癜',
			jubao: ['0/0', '1/0'],
			hebao: [],
			note: '除外：过敏性紫癜及其并发症和后遗症',
			chuze: ['1/1'],
			questionStep: ['0/1,1/#'],
			qa: [{
				question: '是否为过敏性紫癜？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否仅发作过1次，已痊愈，治疗结束至今超过2年，且无尿检、肾功或B超异常？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '血友病，再生障碍性贫血',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '血友病，再生障碍性贫血',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '骨髓异常增生，骨髓穿刺，骨髓移植等血液疾病',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '骨髓异常增生，骨髓穿刺，骨髓移植等血液疾病',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '红斑狼疮，类风湿病，重症联合免疫缺陷（SCID),其它免疫缺陷病',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '红斑狼疮，类风湿病，重症联合免疫缺陷（SCID),其它免疫缺陷病',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}],
		}]
	}, {
		dName: '眼耳口鼻咽喉疾病',
		children: [{
			dName: '白内障',
			jubao: ['0/0'],
			hebao: ['0/1'],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '是否为单纯性白内障（非全身性疾病所致，如糖尿病等），白内障手术后痊愈至今已满1年以上，且无双眼视力障碍及其它并发症（如眼内炎、大疱性角膜病变、人工晶体错位、囊性黄斑水肿、视网膜脱离）？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '中耳炎',
			jubao: ['0/1'],
			hebao: ['1/1'],
			note: '除外：中耳炎及其并发症和后遗症',
			chuze: ['1/0'],
			questionStep: ['0/0,1/#'],
			qa: [{
				question: '是否被诊断有慢性中耳炎，或是有胆脂瘤，或是曾住院治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否已痊愈超1年，且无听力减退、骨膜穿孔、耳朵流水或流脓？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, ],
		}, {
			dName: '牙痛',
			jubao: [],
			hebao: ['0/0'],
			note: '除外：牙齿、牙周疾病及其并发症和后遗症',
			chuze: ['0/1'],
			questionStep: [],
			qa: [{
				question: '目前是否发病或治疗中，或痊愈至今未满3个月，或牙痛为齿科疾病、牙齿畸正（正畸）所致？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '牙周炎',
			jubao: [],
			hebao: ['0/0'],
			note: '除外：牙周炎及其并发症和后遗症',
			chuze: ['0/1'],
			questionStep: [],
			qa: [{
				question: '目前是否发病或治疗中，或痊愈至今未满3个月？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '牙（龈）出血',
			jubao: ['0/1', '1/1', '2/1'],
			hebao: ['2/0'],
			note: '',
			chuze: [],
			questionStep: ['0/0,1/0,2/#'],
			qa: [{
				question: '最近一年内是否有过鼻出血，或是皮肤瘀点，或牙（龈）出血为血液系统疾病（血小板减少、白血病、凝血功能障碍等）所致？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '最近6个月内是否有出血超过2次，或是发热？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否曾被医生要求做骨髓穿刺检查或住院治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '腮腺炎',
			jubao: ['0/0'],
			hebao: ['0/1'],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '是否已痊愈6个月以上？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '鼻炎',
			jubao: [],
			hebao: ['0/0'],
			note: '除外：鼻炎及其并发症和后遗症',
			chuze: ['0/1'],
			questionStep: [],
			qa: [{
				question: '最近2年内是否曾接受过手术或住院治疗，或曾被诊断为“慢性鼻炎”？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '鼻窦炎',
			jubao: [],
			hebao: ['0/0'],
			note: '除外：鼻炎及其并发症和后遗症',
			chuze: ['0/1'],
			questionStep: [],
			qa: [{
				question: '最近3年内是否曾接受过手术或住院治疗，或曾被诊断为“慢性鼻炎”？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '鼻息肉',
			jubao: ['0/0'],
			hebao: ['1/0'],
			note: '除外：鼻炎及其并发症和后遗症',
			chuze: ['1/1'],
			questionStep: ['0/1,1/#'],
			qa: [{
				question: '是否已手术切除，且术后病理检查结果为良性？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '除该次息肉以外，以往是否也有过鼻息肉？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '鼻出血',
			jubao: ['1/1', '2/1'],
			hebao: [],
			note: '',
			chuze: ['1/0', '2/0'],
			questionStep: ['0/0,1/#', '0/1,2/#'],
			qa: [{
				question: '是否去医院检查过？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '半年内是否出血达3次及以上？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否发现息肉、肿块、或被医生要求验血、CT检查、穿刺检查，或住院治疗，或鼻出血为血液系统疾病（血小板减少、白血病、凝血功能障碍等）所致？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '扁桃体炎',
			jubao: [],
			hebao: ['0/1', '1/0'],
			note: '除外：扁桃体炎及其并发症和后遗症',
			chuze: ['1/1'],
			questionStep: ['0/0,1/#'],
			qa: [{
				question: '是否已经手术切除扁桃腺？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否曾被诊断有慢性扁桃腺炎？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '扁桃腺手术史',
			jubao: ['0/0'],
			hebao: ['1/1'],
			note: '除外：扁桃体炎及其并发症和后遗症',
			chuze: ['1/0'],
			questionStep: ['0/1,1/#'],
			qa: [{
				question: '是否诊断为扁桃腺发炎？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否术后痊愈至今大于3个月？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '咽（喉）炎',
			jubao: [],
			hebao: ['1/0'],
			note: '除外：咽（喉）炎及其并发症和后遗症',
			chuze: ['0/1', '1/1'],
			questionStep: ['0/0,1/#'],
			qa: [{
				question: '是否曾住院治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否曾被诊断慢性咽（喉）炎，或痊愈至今不足3个月？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '声带息肉',
			jubao: ['1/0', '1/-1'],
			hebao: ['1/1'],
			note: '除外：声带息肉及其并发症和后遗症',
			chuze: ['0/0'],
			questionStep: ['0/1,1/#'],
			qa: [{
				question: '是否已手术切除且已痊愈至少6个月？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否已经被医生确诊为良性？',
				answersType: 0,
				answerWord: '不清楚',
				otherAnswer: true,
			}],
		}, {
			dName: '普通感冒，急性上呼吸道感染',
			jubao: [],
			hebao: ['0/0'],
			note: '除外：呼吸系统感染性疾病及其并发症和后遗症',
			chuze: ['0/1'],
			questionStep: [],
			qa: [{
				question: '是否曾接受过住院治疗（无论时间长短）且出院至今未满6个月，或是持续2周以上的门诊治疗？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '青光眼',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '青光眼',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}],
		}, {
			dName: '美尼尔氏病（梅尼埃病）',
			jubao: ['0/0', '1/1'],
			hebao: [],
			note: '除外：美尼尔氏病及其并发症和后遗症',
			chuze: ['1/0'],
			questionStep: ['0/1,1/#'],
			qa: [{
				question: '是否已行全面检查，无中枢性疾病、外周性疾病、代谢性疾病？无心脏病、高血压、脑供血不足、动脉硬化及其他潜在疾病？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}, {
				question: '是否存在听力下降或耳聋？',
				answersType: 0,
				answerWord: '',
				otherAnswer: false,
			}],
		}]
	}, {
		dName: '疾病不在上述列表',
		children: [{
			dName: '疾病不在上述列表',
			jubao: ['0/0'],
			hebao: [],
			note: '',
			chuze: [],
			questionStep: [],
			qa: [{
				question: '疾病不在上述列表',
				answersType: 3,
				answerWord: '',
				otherAnswer: false,
			}]
		}]
	}
]
