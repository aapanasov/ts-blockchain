import { createHash } from 'crypto'

type Block = {
  index: number
  timestamp: number
  transactions: Transaction[]
  proof: number
  prevHash: string
}

type Transaction = {
  sender: string
  recipient: string
  amount: number
}


class Blockchain {
  currentTransactions: Transaction[] = []
  chain: Block[] = []

  constructor() {
    // Create the genesis block
    this.addBlock(100)
  }

  addBlock(proof: number, prevHash: string = '') {
    const block: Block = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.currentTransactions,
      proof: proof,
      prevHash: prevHash ?? Blockchain.hash(this.lastBlock)
    }

    // reset current transactions
    this.currentTransactions = []

    this.chain.push(block)
    return block

  }

  addTransaction(sender: string, recipient: string, amount: number) {
    this.currentTransactions.push(
      {
        sender,
        recipient,
        amount,
      }
    )

    return this.lastBlock.index + 1
  }

  get lastBlock(): Block {
    return this.chain[ this.chain.length - 1 ];
  }

  proofOfWork(lastProof: number): number {
    let proof = 0;
    while (!Blockchain.validProof(lastProof, proof)) {
      proof++
    }
    return proof
  }

  static hash(block: Block): string {
    const blockString = JSON.stringify(block)
    return createHash('sha256').update(blockString).digest('hex')
  }

  static validProof(lastProof: number, proof: number): boolean {
    const guess = `${lastProof * proof}`
    const guessHash = createHash('sha256').update(guess).digest('hex')
    console.log('Guess: ', guess, 'Guess Hash: ', guessHash)

    return guessHash.slice(0, 4) === '0000'
  }

}



const block: Block = {
  index: 1,
  timestamp: 1660389388102,
  transactions: [
    {
      sender: "8527147fe1f5426f9dd545de4b27ee00",
      recipient: "a77f5cdfa2934df3954a5c7c7da5df1f",
      amount: 5,
    }
  ],
  proof: 324984774000,
  prevHash: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
}

const blockchain = new Blockchain()
blockchain.addTransaction('Corvin', 'Blaze', 5)
blockchain.addTransaction('Jara', 'Corvin', 2)
blockchain.addTransaction('Blaze', 'Merlin', 2)
console.log(blockchain.currentTransactions)
console.log(blockchain.chain)
blockchain.addBlock(101)
console.log(blockchain.chain)
console.log(blockchain.currentTransactions)

