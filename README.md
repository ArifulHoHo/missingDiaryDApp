# MissingDiaryDApp

Missing diaries is a DApp which keeps the record of missing people around us. The DApp uses an ethereum private network using Ganache, Remix IDE is used to write and test the smart contract in solidity. It also needs the setup of truffle to develop the decentralized application(DApp) and metamask to access the geth accounts. **Ubuntu 20.04** is used to setup and create and test the whole project.

## What are these?

### DApp or Decentralized Application:

A DApp, short for Decentralized Application, is a type of software application that runs on a decentralized network of computers rather than being hosted on a single centralized server. The key characteristics of DApps are:
* Decentralization: Unlike traditional applications that rely on a central server, DApps operate on a decentralized network of nodes. This decentralized nature ensures that no single entity has complete control over the application.
* Blockchain Technology: DApps often leverage blockchain technology, which is a distributed ledger that records transactions across a network of computers. The blockchain provides transparency, immutability, and security to the data and logic of the application.
* Smart Contracts: DApps commonly use smart contracts, which are self-executing contracts with the terms of the agreement directly written into code. Smart contracts run on blockchain platforms like Ethereum and automatically execute predefined actions when certain conditions are met.
  
### Ethereum and Ganache:

**Ethereum** is a decentralized platform that enables the creation and execution of smart contracts and decentralized applications (DApps). Unlike **Bitcoin**, which primarily focuses on peer-to-peer transactions, Ethereum extends the blockchain concept to include a wide range of applications. The native cryptocurrency of Ethereum is called **Ether (ETH)**. One of the key features that makes Ethereum stand out is its ability to execute smart contracts, which are self-executing contracts with the terms written directly into code. For more info: https://ethereum.org/en/

**Ganache** is a personal blockchain for Ethereum development that you can use to test your smart contracts during the development phase. It provides a local blockchain environment, which means you can run Ethereum nodes on your machine for testing purposes. Read https://trufflesuite.com/docs/ganache/ for more.

### Remix IDE and Solidity

**Remix** is an open-source web and desktop application that helps developers write, test, and deploy smart contracts on the Ethereum blockchain. It provides an integrated development environment (IDE) specifically designed for Solidity, which is the programming language used for writing smart contracts on Ethereum. Remix offers a user-friendly interface with features like code highlighting, debugging, and a built-in compiler, making it easier for developers to create and test their smart contracts. Click https://remix.ethereum.org/ to try out remix IDE.

**Solidity** is the programming language of choice for Ethereum smart contracts. It's a statically-typed language designed for developing smart contracts that run on the **Ethereum Virtual Machine (EVM)**. Smart contracts are self-executing contracts with the terms of the agreement directly written into code. Solidity allows developers to define the rules and logic of these contracts. More info and documentation at https://soliditylang.org/ 

### Truffle and Metamask

**Truffle** is a development framework for Ethereum that simplifies the process of building, testing, and deploying decentralized applications (DApps) and smart contracts. It provides a suite of tools that make Ethereum development more efficient and streamlined. More info at https://trufflesuite.com/ 

**MetaMask** is a browser extension and mobile app that serves as a cryptocurrency wallet and a gateway to blockchain applications. More at https://metamask.io/

## App features

* **Missing Person**: The DApp will store data of missing persons. Specifically, you need to store a person's name, age, height, status(either “missing” or “found”), small description, division from where the person got missing and a relative’s contact number.
* **Add Data**: Users can post data of missing people. Added data should be visible to the user without refreshing the page right after posting it.
* **Actions**: Users may need to search missing people in a specific area. Therefore, you need to add a feature where users can search missing people by filtering 8 divisions of bangladesh. For example: Dhaka, Chittagong etc. In addition you must show the missing count of all of the eight districts in **ascending or descending** order and the median value of missing persons count among them.
* **Update missing status**: There are some predefined users, who work as admin. An “admin” only can update the missing status from “status: missing” to “status: found” in the application.

## Installation Guide

A pdf has been uploaded or visit https://github.com/YEASIN49/CSE446-Content/tree/main/Lab%2006 to know how to set up a DApp using Metamask, Ganache and Truffle.
* **Add Data**: Users can post data of missing people. Added data should be visible to the user without refreshing the page right after posting it.
* **Actions**: Users may need to search missing people in a specific area. Therefore, you need to add a feature where users can search missing people by filtering 8 divisions of bangladesh. For example: Dhaka, Chittagong etc. In addition you must show the missing count of all of the eight districts in ascending or descending order and the median value of missing persons count among them.
* **Update missing status**: There are some predefined users, who work as admin. An “admin” only can update the missing status from “status: missing” to “status: found” in the application.
