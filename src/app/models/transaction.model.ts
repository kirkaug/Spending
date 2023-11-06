export interface Transaction {
  id: number;
  date: Date;
  description: string;
  amount: number;
  category: string; // This could be an ID linking to a Category model
  type: 'income' | 'expense';
}
