import React, {Component} from 'react';
import ReactDOM from "react-dom";
import ComMobile from "./components/ComMobile";
import ComCard from "./components/ComCard";
import ComBank from "./components/ComBank";

class App extends Component {
    ref_mobile = React.createRef()
    ref_card = React.createRef()
    ref_bank = React.createRef()

    componentDidMount() {
        window.utools && window.utools.onPluginEnter(({ code, type, payload }) => {
            const el = ReactDOM.findDOMNode(this[`ref_${code}`].current)
            el.scrollIntoView({ behavior: "smooth", block: "start"})
        })
    }

    render() {
        return (
            <>
                <ComMobile ref={this.ref_mobile} />
                <ComCard ref={this.ref_card} />
                <ComBank ref={this.ref_bank} />
            </>
        );
    }
}

export default App;
