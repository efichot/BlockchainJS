import CryptoJS from 'crypto-js';

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress;
        this.toAddress = toAddress;
        this.amount = amount;
    }
}

class Block {
    constructor(timestamp, transactions, previousHash = '') { // in reality Version, PreviousBlockHash, Merkle Root, Timestamp, Difficulty Target, Nonce 
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return CryptoJS.SHA256(CryptoJS.SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash + this.nonce).toString()).toString(); // twice in sha256
    }

    mineBlock(difficulty) {
        while (this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")) {
            this.nonce++;
            this.hash = this.calculateHash();
        }

        console.log(`Block Mined ${this.hash}`);
    }
}

class Blockchain {
    constructor(difficulty) {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = difficulty;
        this.pendingTransactions = [];
        this.miningReward = 100;
    }

    createGenesisBlock() {
        return new Block(Date.now(), "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(rewardAddress) {
        let block = new Block(Date.now(), this.pendingTransactions); // in BTC not all the pending Tx are added in the block because 1mb block size max so miners choise what block they want added.
        block.mineBlock(this.difficulty);
        console.log("Block succesfully mined");
        this.chain.push(block);
        this.pendingTransactions = [
            new Transaction(null, rewardAddress, this.miningReward)
        ];
    }

    createTransactions(transaction) {
        this.pendingTransactions.push(transaction);
    }

    getBalance(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount;
                }
                if (trans.toAddress === address) {
                    balance += trans.amount;
                }
            }
        }
        return balance;
    }

    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) { // skip genesis block
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }

            return true;
        }
    }
}

var myBlockchain = new Blockchain(2);
myBlockchain.createTransactions(new Transaction("Etienne", "Vincent", 50));
myBlockchain.createTransactions(new Transaction("Vincent", "Etienne", 250));
console.log("Starting the miner....");
myBlockchain.minePendingTransactions("Etienne");
myBlockchain.createTransactions(new Transaction("Vincent", "Etienne", 10));
myBlockchain.minePendingTransactions("Etienne");
console.log("My balance is ", myBlockchain.getBalance("Etienne"));