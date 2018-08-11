import React from "react";
import EmbarkJS from "Embark/EmbarkJS";
import { BrowserRouter as Router } from "react-router-dom";

import AccountSelector from "../components/AccountSelector";
import AddNumber from "../components/AddNumber";

export default class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            accounts: [],
            currentAccount: "",
            balance: 0
        };
    }

    loadAccountUsers() {
        web3.eth.getAccounts().then(accounts => {
            this.setState({
                accounts
            });
            this.onAccountChange(accounts[0]);
        });
    }

    onAccountChange = accnt => {
        this.setState({
            currentAccount: accnt
        });

        web3.eth.defaultAccount = accnt;

        web3.eth.getBalance(accnt).then(balance => {
            balance = web3.utils.fromWei(balance, "ether");
            balance = Number.parseFloat(balance).toFixed(3);

            this.setState({
                balance
            });
        });
    };

    componentDidMount() {
        EmbarkJS.onReady(() => {
            this.loadAccountUsers();
        });
    }

    render() {
        return (
            <div>
                <Router>
                    <AccountSelector
                        accounts={this.state.accounts}
                        onAccountChange={this.onAccountChange}
                        currentAccount={this.state.currentAccount}
                        balance={this.state.balance}
                    />
                </Router>
                <AddNumber />
            </div>
        );
    }
}
