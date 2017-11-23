import CryptoJS from 'crypto-js';

class Block {
    constructor(index, timestamp, data, previousHash = '') { // in reality Version, PreviousBlockHash, Merkle Root, Timestamp, Difficulty Target, Nonce 
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
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

        console.log(`Block ${this.index}:  ${this.hash}`);
    }
}

class Blockchain {
    constructor(difficulty) {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = difficulty;
    }

    createGenesisBlock() {
        return new Block(0, Date.now(), "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
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

var myBlockchain = new Blockchain(4);
myBlockchain.addBlock(new Block(1, Date.now(), { name: "Etienne" }));
myBlockchain.addBlock(new Block(2, Date.now(), { name: "Gabrielle" }));

console.log("Is blockchain valid? " + myBlockchain.isChainValid());

console.log(JSON.stringify(myBlockchain, null, 4));