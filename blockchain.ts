import { createHash } from 'crypto'

type Block = {
  index: number
  timestamp: number
  transactions: Transaction[]
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
    this.addBlock()
  }

  addBlock(): void {
    const block: Block = {
      index: this.chain.length + 1,
      timestamp: Date.now(),
      transactions: this.currentTransactions,
      prevHash: this.hash(this.lastBlock ?? 'Genesis Block')
    }

    this.chain.push(block)
    this.currentTransactions = []
  }

  addTransaction(
    sender: string,
    recipient: string,
    amount: number
  ): void {
    this.currentTransactions.push({ sender, recipient, amount, })
  }

  get lastBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  hash(block: Block): string {
    const blockString = JSON.stringify(block)
    return createHash('sha256').update(blockString).digest('hex')
  }

  get isValid(): boolean {
    for (let i = 1; i < this.chain.length; i++) {
      const block = this.chain[i]
      const prevBlock = this.chain[i - 1]

      if (block.prevHash !== this.hash(prevBlock))
        return false
    }
    return true
  }
}



const block = {
  index: 1,
  timestamp: 1660389388102,
  transactions: [
    {
      sender: "8527147fe1f5426f9dd545de4b27ee00",
      recipient: "a77f5cdfa2934df3954a5c7c7da5df1f",
      amount: 5,
    }
  ],
  prevHash: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824"
}

const blockchain = new Blockchain()
blockchain.addTransaction('Corvin', 'Blaze', 5)
blockchain.addBlock()
blockchain.addTransaction('Random', 'Corvin', 2)
blockchain.addTransaction('Julian', 'Eric', 3)
blockchain.addBlock()

blockchain.chain[1].transactions.push(
  { sender: 'Merlin', recipient: 'Dara', amount: 100 }
)

console.log(...blockchain.chain)
console.log('\nIs blockchain valid: ', blockchain.isValid)


