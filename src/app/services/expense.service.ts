import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { Expense } from '../models/expense.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/expenses`).pipe(
      tap(expenses => console.log('Fetched expenses:', expenses)),
      catchError(error => {
        console.error('Error fetching expenses:', error);
        throw error;
      })
    );
  }

  getExpensesByDateRange(startDate: Date, endDate: Date): Observable<Expense[]> {
    return this.http.get<Expense[]>(
      `${this.apiUrl}/expenses/range?start=${startDate.toISOString()}&end=${endDate.toISOString()}`
    ).pipe(
      tap(expenses => console.log('Fetched expenses by date range:', expenses)),
      catchError(error => {
        console.error('Error fetching expenses by date range:', error);
        throw error;
      })
    );
  }

  addExpense(expense: Omit<Expense, 'id'>): Observable<Expense> {
    console.log('Sending expense data:', expense);
    return this.http.post<Expense>(`${this.apiUrl}/expenses`, expense).pipe(
      tap(savedExpense => console.log('Saved expense:', savedExpense)),
      catchError(error => {
        console.error('Error saving expense:', error);
        throw error;
      })
    );
  }

  getExpensesByDepartment(departmentId: number): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${this.apiUrl}/expenses/department/${departmentId}`).pipe(
      tap(expenses => console.log('Fetched expenses by department:', expenses)),
      catchError(error => {
        console.error('Error fetching expenses by department:', error);
        throw error;
      })
    );
  }
}