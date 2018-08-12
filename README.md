# ETHIndia
Submission for ETHIndia hackathon.

**Dapp Name:** DSource

# Elevator Pitch
**Crowdsourced. Decentralized. Monetized.**

We propose a model to crowdsource data in a decentralized manner. Our smart contract ensures that all data providers get returns. We monetize queries and distribute the collected "revenue" among the data providers in a fair manner.

The model proposes a unique concept called data scores which help in evaluating the quality of data provided. The rewards are distributed according to the data scores ensuring the quality of data. Data providers can periodically collect rewards (if available) individually through the smart contract making the model truly decentralized. 

Our app is a Proof of Concept for the above model which tries to decentralize a phone directory (inspired from Truecaller).



# Installing
- Clone the repo from `https://github.com/adishegde/ethindia`
- The Dapp is developed using Embark. Run `yarn install` to install dependencies.
- Run `embark run` to run start the Dapp in development mode.
- Open `localhost:8000` on the browser to start using the Dapp.

# Overview
As a Proof of Concept for our model we have tried to implement a decentralized phone directory (similar to TrueCaller).
Due to lack of time we weren't able to implement the entire model (see challenges faced).

# Usage

The app consists of 3 functionalities:

- **Inserting contact details:** Here JSON data is input which is then inserted into the smart contract. The idea is to
  simulate a contact API which would return data in a similar format.

- **Querying data:** Data inserted can be queried through the mobile number. Queries require a small fees as 
proposed by our model, however, we have used a high fee (0.1 ETH) in development for clarity.

- **Accounts:** Queries can be sent and contacts can be added from different accounts. The "Collect Payment" button
enables the user to collect his reward. The reward will be zero if called again within a time interval.
However, this interval has been set to 1 second in development mode. This is basically an implementation of
the decentralized reward collection system as proposed by our model. 

# Project Details and Solutions
Existing solutions to crowdsourced data are extremely centralized and often do not reward the data providers (i.e. the individuals who generate data). Due to the centralized nature, data can be easily misused leading to lack of trust in the service providers.

Our model rectifies this problem by decentralizing the service and also rewarding data providers. Users upload data to a decentralized store via a smart contract. The data is stored securely and any access to it is provided only through the smart contract.

This data can be then queried through the smart contract in exchange for a small fee. The collected fee is distributed among the data providers according to their data score. The data providers periodically call a method on the smart contract which transfers the reward if available.

Data scores are assigned based on the frequency of queries on provided data and reviews of the queried data.

Note: Our app is a Proof of Concept for the above model which tries to decentralize a phone directory (inspired from Truecaller).
