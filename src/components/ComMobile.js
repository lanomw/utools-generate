import React, {Component} from 'react'
const { random } = require('../utils/util')

class ComMobile extends Component {
    state = {
        prefix: '',
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
        const {prefix, num} = this.state

        switch (type) {
            case 'prefix':
                this.setState({prefix: /^1[0-9]{0,9}$/.test(value) ? value : prefix});
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
        const prefixArray = ['130', '131', '132', '133', '135', '137', '138', '170', '187', '189']
        let {prefix, num} = this.state
        num = num || 1
        const len = prefixArray.length

        const list = []
        for (let i = 0; i < num; i++) {
            let mobile = prefix || prefixArray[random(len - 1)]
            while (mobile.length < 11) {
                mobile += random(0, 9);
            }
            list.push(mobile)
        }
        this.setState({list})
    }

    render() {
        return (
            <div className="card">
                <h1 className="title">手机号码生成<span>生成数据根据相应规则产生，能通过相应检验规则，不保证号码的有效性</span></h1>
                <div className="row">
                    <div className="row-item">
                        <label>手机号前缀:</label>
                        <input className="" type="text" placeholder="前缀" data-type="prefix" onInput={this.onInput}
                               value={this.state.prefix}/>
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
                        <span>手机号码</span>
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

export default ComMobile;
