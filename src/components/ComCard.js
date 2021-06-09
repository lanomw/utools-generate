import React, {Component} from 'react'

const {random} = require('../utils/util')

class ComCard extends Component {
    state = {
        startDate: '',
        endDate: '',
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
        let {startDate, endDate, num} = this.state
        const startDateArr = startDate.split('-')
        const endDateArr = endDate.split('-')

        num = num || 1
        const list = []
        for (let i = 0; i < num; i++) {
            let idcard = ''
            for (let i = 0; i < 18; i++) {
                if(i < 6) {
                    idcard += random(9)
                }else if(i === 6) { // 年份
                    if (startDate && endDate) { // 范围日期
                        // 日期比较
                        const compare = parseInt(endDate.replaceAll('-', '')) - parseInt(startDate.replaceAll('-', ''))
                        let startYear, endYear, startMonth, endMonth, startDay, endDay;
                        if (compare >= 0) {
                            startYear = parseInt(startDateArr[0])
                            endYear = parseInt(endDateArr[0])
                            startMonth = parseInt(startDateArr[1])
                            endMonth = parseInt(endDateArr[1])
                            startDay = parseInt(startDateArr[2])
                            endDay = parseInt(endDateArr[2])
                        } else if (compare < 0) {
                            startYear = parseInt(endDateArr[0])
                            endYear = parseInt(startDateArr[0])
                            startMonth = parseInt(endDateArr[1])
                            endMonth = parseInt(startDateArr[1])
                            startDay = parseInt(endDateArr[2])
                            endDay = parseInt(startDateArr[2])
                        }

                        const year = random(startYear, endYear)

                        let month
                        // 月份在最大最小年份时需要在范围内
                        if (startMonth === endMonth) { // 月份相等
                            month = startMonth
                        } else if (startYear === endYear) { // 相同年
                            month = random(startMonth, endMonth)
                        } else if (year === startYear) { // 最小年
                            month = random(startMonth, 12)
                        } else if (year === endYear) { // 最大年
                            month = random(1, endMonth)
                        } else {
                            month = random(1, 12)
                        }

                        // 获取当月最大天数
                        let day
                        const maxDays = new Date(year, month, 0).getDate();
                        // 月份在最大最小年份时需要在范围内
                        if (startDay === endDay) { // 天数相等
                            day = startDay
                        } else if (startMonth === endMonth) { // 相同月
                            day = random(startDay, endDay)
                        } else if (month === startMonth) { // 最小月
                            day = random(startDay, maxDays)
                        } else if (month === endMonth) { // 最大月
                            day = random(1, endDay)
                        } else {
                            day = random(1, maxDays)
                        }

                        month = `0${month}`.substr(-2, 2)
                        day = `0${day}`.substr(-2, 2)

                        idcard += `${year}${month}${day}`
                    } else if (startDate || endDate) { // 固定日期
                        idcard += (startDate || endDate).replaceAll('-', '')
                    } else { // 随机日期 -年的第一位
                        idcard += random(1, 2); //年份第一位仅支持1和2
                    }
                }else if(i === 7) { // 随机日期 -年的第二位
                    idcard += idcard[6] === '1' ? 9 : 0;//两位年份规则，仅支持19和20
                }else if(i === 8) { // 随机日期 -年的第三位
                    idcard += idcard[6] === '1' ? random(3, 9) : random(2); //三位年份规则，仅支持193-199、200、201这些值
                }else if(i === 9) { // 随机日期 -年的第四位
                    idcard += random(9) //四位年份规则,0-9
                }else if(i === 10) { // 随机日期 -月的第一位
                    idcard += random(2);//首位月份规则
                }else if(i === 11) { // 随机日期 -月的第二位
                    idcard += idcard[10] === '0' ? random(1, 9) : random(3);//末位月份规则
                }else if(i === 12) { // 随机日期 -日
                    var maxDays = new Date(idcard.substr(6, 4), idcard.substr(10, 2), 0).getDate(); // 获取当月最大天数
                    var day = random(1, maxDays)
                    idcard += day < 10 ? ('0' + day) : day;
                    i++
                }else if(i > 13 && i < 17) {
                    idcard += random(9)
                }else if(i === 17) {
                    idcard += this.cnNewID(idcard);
                }
            }
            list.push(idcard)
        }
        this.setState({list})
    }

    // 根据前17位生成末位
    cnNewID = (idcard) => {
        const arrExp = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2]; // 加权因子
        const arrValid = [1, 0, "X", 9, 8, 7, 6, 5, 4, 3, 2]; // 校验码
        let sum = 0, idx;
        for (var j = 0; j < 17; j++) {
            // 对前17位数字与权值乘积求和
            sum += parseInt(idcard[j], 10) * arrExp[j];
        }
        return arrValid[sum % 11];
    }

    render() {
        return (
            <div className="card">
                <h1 className="title">身份证号码生成<span>生成数据根据相应规则产生，能通过相应检验规则，不保证号码的有效性</span></h1>
                <div className="row">
                    <div className="row-item">
                        <label>时间范围:</label>
                        <input className="" type="date" data-type="startDate" onChange={this.onInput}
                               value={this.state.startDate}/>
                        <input className="" type="date" data-type="endDate" onChange={this.onInput}
                               value={this.state.endDate}/>
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
