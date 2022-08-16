import React, {Component} from 'react'
const { random } = require('../utils/util')

class ComBank extends Component {
    state = {
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
        const {num} = this.state

        switch (type) {
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
        let {num} = this.state
        num = num || 1

        const list = []
        for (let i = 0; i < num; i++) {
            let bankNo = '6222'
            while (bankNo.length < 15) {
                bankNo += random(0, 9);
            }
            // 补上末位，保证号码符合 Luhn 规则
            list.push(this.getLastNo(bankNo))
        }
        this.setState({list})
    }

    /**
     * 获取末位补齐号码，使号码符合 Luhn 规则
     * Luhn算法：
     *  1. 号码从右至左进行遍历求和
     *  2. 奇数位则返回本身，偶数位乘以2进行判断，如果大于10则个位和十位相加返回，否则直接返回
     *  4. 最总结果能被10整除
     *
     *  号码校验：http://yinhangkahao.com/zhenjiayinhangka.html
     * @param bankNo
     */
    getLastNo = (bankNo) => {
        let s = 0
        for (let i = 0; i < bankNo.length; i++) {
            let t = parseInt(bankNo[i])
            if (i % 2 === 0) {
                t *= 2
                s += t < 10 ? t : t % 10 + parseInt(t / 10)
            } else {
                s += t
            }
        }
        bankNo += (10 - s %10) % 10

        return bankNo
    }

    render() {
        return (
            <div className="card">
                <h1 className="title">银行卡号码生成<span>生成数据根据相应规则产生，能通过相应检验规则，不保证号码的有效性</span></h1>
                <div className="row">
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
                        <span>银行卡号码</span>
                        <button className="ml-auto" onClick={() => this.onCopy()}>复制</button>
                    </div>
                    {
                        this.state.list.map((item, index) => (
                            <div className="out-item" key={index} onClick={() => this.onCopy(item)}>
                                <span className="no">{index + 1}</span>
                                <span>{item}</span>
                                <button className="ml-auto">复制</button>
                            </div>
                        ))
                    }
                </div>
            </div>
        );
    }
}

export default ComBank;
