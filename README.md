# ETHIndia
Submission for ETHIndia hackathon.

**Dapp Name:** DSource

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
