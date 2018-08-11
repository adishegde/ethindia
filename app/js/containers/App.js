import React from "react";
import EmbarkJS from "Embark/EmbarkJS";
import { BrowserRouter as Router } from "react-router-dom";

import AccountSelector from "../components/AccountSelector";

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
        web3.eth
            .getAccounts()
            .then(accounts => {
                this.setState({
                    accounts
                });
                this.onAccountChange(accounts[0]);
            })
            .catch(err => {
                console.log(`App.loadAccountUsers: ${err}`);
            });
    }

    onAccountChange = accnt => {
        this.setState({
            currentAccount: accnt
        });

        web3.eth.defaultAccount = accnt;

        web3.eth
            .getBalance(accnt)
            .then(balance => {
                balance = web3.utils.fromWei(balance, "ether");
                balance = Number.parseFloat(balance).toFixed(3);

                this.setState({
                    balance
                });
            })
            .catch(err => {
                console.log(`App.onAccountChange: ${err}`);
            });
    };

    componentDidMount() {
        EmbarkJS.onReady(() => {
            this.loadAccountUsers();
        });
    }

    render() {
        return (
            <Router>
                <AccountSelector
                    accounts={this.state.accounts}
                    onAccountChange={this.onAccountChange}
                    currentAccount={this.state.currentAccount}
                    balance={this.state.balance}
                />
            </Router>
        );
    }
}
