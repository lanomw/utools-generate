import React, {Component} from 'react'

const {random} = require('../utils/util')

const city = {
    11: "北京",
    12: "天津",
    13: "河北",
    14: "山西",
    15: "内蒙古",
    21: "辽宁",
    22: "吉林",
    23: "黑龙江",
    31: "上海",
    32: "江苏",
    33: "浙江",
    34: "安徽",
    35: "福建",
    36: "江西",
    37: "山东",
    41: "河南",
    42: "湖北",
    43: "湖南",
    44: "广东",
    45: "广西",
    46: "海南",
    50: "重庆",
    51: "四川",
    52: "贵州",
    53: "云南",
    54: "西藏",
    61: "陕西",
    62: "甘肃",
    63: "青海",
    64: "宁夏",
    65: "新疆",
    71: "台湾",
    81: "香港",
    82: "澳门",
    91: "国外"
};
const cityCode = [11, 12, 13, 14, 15, 21, 22, 23, 31, 32, 33, 34, 35, 36, 37, 41, 42, 43, 44, 45, 46, 50, 51, 52, 53, 54, 61, 62, 63, 64, 65, 71, 81, 82, 91]

function fillZero(str, len = 0) {
    return `${'0'.repeat(len)}${str}`.slice(-len)
}

function getDayByYearMonth(year, month) {
    const isLeapYear = year % 4 === 0 && year % 100 !== 0 || year % 400 === 0
    return [1, 3, 5, 7, 8, 10, 12].includes(month) ? 31
        : month === 2 ? (isLeapYear ? 29 : 28)
            : 30
}

class ComCard extends Component {
    state = {
        startDateLimit: '',
        endDateLimit: '',
        num: 5,
        list: [],
    }

    componentDidMount() {
        if (!this.state.list.length) {
            this.onSubmit()
        }
    }

    onInput = (e) => {
        const value = e.target.value
        const type = e.target.dataset.type
        const {num, startDate, endDate} = this.state

        switch (type) {
            case 'startDate':
                value && this.setState({startDate: value})
                break
            case 'endDate':
                value && this.setState({endDate: value});
                break
            case 'num':
                this.setState({num: /^[1-9][0-9]*?$/.test(value) ? value : num});
                break
        }
    }

    // record为空则复制全部
    onCopy(record) {
        window.utools && window.utools.copyText(record || this.state.list)
    }

    onSubmit = () => {
        const {startDateLimit = '1970-01-01', endDateLimit = new Date(), num = 1} = this.state

        const startDate = new Date(startDateLimit)
        const endDate = new Date(endDateLimit)

        const startYear = startDate.getFullYear()
        const endYear = endDate.getFullYear()

        const startMonth = startDate.getMonth() + 1
        const endMonth = endDate.getMonth() + 1

        const startDay = startDate.getDate()
        const endDay = endDate.getDate()

        const list = []
        for (let i = 0; i < num; i++) {
            let idCard = ''

            // 随机日期
            let year, month, day
            // 年
            year = random(startYear, endYear)
            // 月
            if (startYear === year) {
                month = random(startMonth, 12)
            } else if (endYear === year) {
                month = random(1, endMonth)
            } else {
                month = random(1, 12)
                day = random(1, getDayByYearMonth(year, month))
            }
            // 日。边界情况需要单独处理
            if (startYear === year && startMonth === month) {
                day = random(startDay, getDayByYearMonth(year, month))
            } else if (endYear === year && endMonth === month) {
                day = random(1, endDay)
            } else {
                day = random(1, getDayByYearMonth(year, month))
            }

            // 地区号码。首位不为0
            const randomCityCodeIndex = random(1, cityCode.length)
            idCard += fillZero(cityCode[randomCityCodeIndex - 1], 2)
            idCard += fillZero(random(99), 2)
            idCard += fillZero(random(99), 2)

            // 出生日期
            idCard += fillZero(year) + fillZero(month, 2) + fillZero(day, 2)

            // 顺序码
            idCard += fillZero(random(1, 999), 3)

            // 校验码
            idCard += this.validNum(idCard)

            list.push(idCard)
        }

        this.setState({list})
    }

    // 根据前17位生成末位
    validNum = (idCard) => {
        const arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 加权因子
        const arrValid = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2]; // 校验码
        let sum = 0;
        for (let j = 0; j < 17; j++) {
            // 对前17位数字与权值乘积求和
            sum += parseInt(idCard[j]) * arrExp[j];
        }
        return arrValid[sum % 11];
    }

    render() {
        return (
            <div className="card">
                <h1 className="title">身份证号码生成<span>生成数据根据相应规则产生，能通过相应检验规则，不保证号码的有效性</span>
                </h1>
                <div className="row">
                    <div className="row-item">
                        <label>时间范围:</label>
                        <input className="" type="date" data-type="startDateLimit" onChange={this.onInput}
                               value={this.state.startDateLimit}/>
                        <input className="" type="date" data-type="endDateLimit" onChange={this.onInput}
                               value={this.state.endDateLimit}/>
                    </div>
                    <div className="row-item">
                        <label>生成数量:</label>
                        <input className="num" type="text" placeholder="数量" data-type="num" onInput={this.onInput}
                               value={this.state.num}/>
                    </div>
                    <div className="row-item ml-auto">
                        <button className="button" onClick={this.onSubmit}>生成</button>
                    </div>
                </div>
                <div className="out">
                    <div className="out-item header">
                        <span className="no">序号</span>
                        <span>身份证号码</span>
                        <button className="ml-auto" onClick={() => this.onCopy()}>复制全部</button>
                    </div>
                    {
                        this.state.list.map((item, index) => (
                            <div className="out-item" key={index} onClick={() => this.onCopy(item)}>
                                <span className="no">{index + 1}</span>
                                <span>{item}</span>
                                <button className="ml-auto">点击复制</button>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}


export default ComCard;
