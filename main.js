import SHA256 from 'crypto-js';

class Block {
    constructor(index, timestamp, data, previousHash = '') { // in reality Version, PreviousBlockHash, Merkle Root, Timestamp, Difficulty Target, Nonce 
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return SHA256(SHA256(this.index + this.timestamp + JSON.stringify(this.data) + this.previousHash).tostring()).toString(); // twice in sha256
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
    }

    createGenesisBlock() {
        return new Block(0, Date.now(), "Genesis block", "0");
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash();
        this.chain.push(newBlock);
    }
}