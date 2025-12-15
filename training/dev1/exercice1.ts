class CreditCard {
  readonly number: string;
  readonly cvc: string;
  readonly expirationDate: string;

  constructor() {
    const randomDigits = (n: number) => Array.from({ length: n }, () => Math.floor(Math.random() * 10)).join("");
    
    this.number = Array.from({ length: 4 }, () => randomDigits(4)).join(" ");
    this.cvc = randomDigits(3);
    
    const expDate = new Date();
    expDate.setFullYear(expDate.getFullYear() + 5);
    this.expirationDate = `${String(expDate.getMonth() + 1).padStart(2, "0")}/${String(expDate.getFullYear()).slice(-2)}`;
  }
}

class Account {
  readonly accountNumber: string;
  private _balance: number;
  creditCard: CreditCard | null = null;

  constructor(initialDeposit = 0) {
    this.accountNumber = Array.from({ length: 7 }, () => Math.floor(Math.random() * 10)).join("");
    this._balance = initialDeposit;
  }

  get balance(): number {
    return this._balance;
  }

  deposit(amount: number): void {
    if (amount > 0) this._balance += amount;
  }

  withdraw(amount: number): void {
    if (amount > 0 && amount <= this._balance) this._balance -= amount;
  }

  requestCreditCard(): CreditCard {
    if (!this.creditCard) this.creditCard = new CreditCard();
    return this.creditCard;
  }
}

class Client {
  account: Account | null = null;

  constructor(
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly city: string,
    public readonly salary: number
  ) {}

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

class Bank {
  private clients: Map<Client, Account> = new Map();

  constructor(public readonly name: string) {}

  addClient(client: Client, initialDeposit = 0): Account {
    const account = new Account(initialDeposit);
    client.account = account;
    this.clients.set(client, account);
    return account;
  }

  getClientAccount(client: Client): Account | undefined {
    return this.clients.get(client);
  }

  requestCreditCard(client: Client): CreditCard | null {
    return this.getClientAccount(client)?.requestCreditCard() ?? null;
  }
}

// Example usage
const bank = new Bank("BNP Paribas");
const client = new Client("Jean", "Dupont", "Paris", 3500);
const account = bank.addClient(client, 1000);

console.log(`Bank: ${bank.name}`);
console.log(`Client: ${client.fullName}`);
console.log(`Account: ${account.accountNumber} | Balance: ${account.balance}€`);

account.deposit(500);
account.withdraw(200);
console.log(`After operations: ${account.balance}€`);

const card = bank.requestCreditCard(client)!;
console.log(`Card: ${card.number} | CVC: ${card.cvc} | Exp: ${card.expirationDate}`);
