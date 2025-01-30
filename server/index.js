const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/expense-management';
console.log('Attempting to connect to MongoDB at:', mongoURI);

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('Successfully connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

// Models
const expenseSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  employeeId: { type: Number, required: true },
  departmentId: { type: Number, required: true }
}, { 
  timestamps: true,
  versionKey: false 
});

const Expense = mongoose.model('Expense', expenseSchema);

// Routes
app.post('/api/expenses', async (req, res) => {
  try {
    console.log('Received expense data:', req.body);
    
    // Asegurarse de que la fecha sea un objeto Date válido
    const expenseData = {
      ...req.body,
      date: new Date(req.body.date)
    };
    
    const expense = new Expense(expenseData);
    const savedExpense = await expense.save();
    console.log('Saved expense:', savedExpense);
    res.status(201).json(savedExpense);
  } catch (error) {
    console.error('Error saving expense:', error);
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find().sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('Error getting expenses:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/expenses/range', async (req, res) => {
  try {
    const { start, end } = req.query;
    const expenses = await Expense.find({
      date: { $gte: new Date(start), $lte: new Date(end) }
    }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('Error getting expenses by range:', error);
    res.status(500).json({ message: error.message });
  }
});

app.get('/api/expenses/department/:id', async (req, res) => {
  try {
    const expenses = await Expense.find({ 
      departmentId: parseInt(req.params.id) 
    }).sort({ date: -1 });
    res.json(expenses);
  } catch (error) {
    console.error('Error getting expenses by department:', error);
    res.status(500).json({ message: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});