import React, { useState, useEffect } from 'react';
import { Save, X, DollarSign, Calendar, CreditCard, Building } from 'lucide-react';
import { 
  type Expense, 
  type ExpenseFormData, 
  type ExpenseFormErrors, 
  type ExpenseCategory, 
  type CategoryInfo,
  type PaymentMethod, 
  type Branch,
  USER_ROLES
} from '../types';
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

interface ExpenseFormProps {
  expense: Expense | null;
  onSave: (expenseData: Omit<Expense, 'id'>) => void;
  onCancel: () => void;
  categories: CategoryInfo[];
  isLoading:boolean
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ isLoading, expense, onSave, onCancel, categories }) => {
 const offlineBranchData = useSelector((state:RootState)=> state.branch.value)
 const user = useSelector((state:RootState )=>state.user.value)
 const [allBranches] = useState<Branch[] | []>(
      offlineBranchData,
    );
   const [activeBranch, setactiveBranch] = useState(
      user.role === USER_ROLES.SUPER_ADMIN
        ? ""
        : user.branches[0]?.branch_id || "",
    );
  const [formData, setFormData] = useState<ExpenseFormData>({
    description: '',
    amount: '',
    category: 'supplies',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    notes: ''
  });

  const [errors, setErrors] = useState<ExpenseFormErrors>({});

  useEffect(() => {
    if (expense) {
      setFormData({
        description: expense.description || '',
        amount: expense.amount.toString(),
        category: expense.category || 'supplies',
        date: expense.date || new Date().toISOString().split('T')[0],
        paymentMethod: expense.paymentMethod || 'cash',
        notes: expense.notes || ''
      });
    }
  }, [expense]);

  const paymentMethods = [
    { value: 'cash' as PaymentMethod, label: 'Cash' },
    { value: 'mpesa' as PaymentMethod, label: 'M-Pesa' },
    { value: 'bank' as PaymentMethod, label: 'Bank Transfer' },
    { value: 'card' as PaymentMethod, label: 'Card' }
  ];

  const validateForm = (): boolean => {
    const newErrors: ExpenseFormErrors = {};
     if (!activeBranch) {
      newErrors.description = 'Select a branch';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Valid amount is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof ExpenseFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave({
        branch_id:activeBranch,
        ...formData,
        amount: Number(formData.amount)
      } as Omit<Expense, 'id'>);
    }
  };

  const getCategoryColor = (categoryId: ExpenseCategory): string => {
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.color.replace('bg-', 'bg-') : 'bg-gray-500';
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error Alert */}
      {Object.keys(errors).length > 0 && (
        <div className="px-4 py-3 text-red-700 border border-red-200 rounded-lg bg-red-50">
          Please fix the errors in the form
        </div>
      )}

           {/* Branch Selection */}
                {user.role === USER_ROLES.SUPER_ADMIN && (
                  <div className="mb-6">
                    <label className="block mb-2 text-sm font-medium text-gray-700">
                      Select Branch
                    </label>
                    <div className="relative">
                      <Building className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
                      <select
                        value={activeBranch}
                        onChange={(e) => setactiveBranch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                        required
                      >
                        <option value="">Select a branch</option>
                        {allBranches.map((b) => (
                          <option key={b._id} value={b._id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
      

      {/* Description */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Expense Description *
        </label>
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="e.g., Detergent purchase, Machine repair..."
          className={`w-full border ${errors.description ? 'border-red-500' : 'border-gray-300'} rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description}</p>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Amount */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Amount (Ksh) *
          </label>
          <div className="relative">
            <DollarSign className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className={`w-full border ${errors.amount ? 'border-red-500' : 'border-gray-300'} rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>
          {errors.amount && (
            <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Date *
          </label>
          <div className="relative">
            <Calendar className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={`w-full border ${errors.date ? 'border-red-500' : 'border-gray-300'} rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
            />
          </div>
          {errors.date && (
            <p className="mt-1 text-sm text-red-600">{errors.date}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {/* Category */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Category *
          </label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.label}
              </option>
            ))}
          </select>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">
            Payment Method *
          </label>
          <div className="relative">
            <CreditCard className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
              className="w-full py-2 pl-10 pr-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {paymentMethods.map((method) => (
                <option key={method.value} value={method.value}>
                  {method.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Additional Notes (Optional)
        </label>
        <textarea
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Any additional information about this expense..."
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Info Alert for Editing */}
      {expense && (
        <div className="px-4 py-3 text-blue-700 border border-blue-200 rounded-lg bg-blue-50">
          Editing expense #{expense._id} created on {expense.date}
        </div>
      )}

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center justify-center flex-1 gap-2 px-4 py-2 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          <X className="w-4 h-4" />
          Cancel
        </button>
        <button
          disabled = {isLoading }
          type="submit"
          className="flex items-center justify-center flex-1 gap-2 px-4 py-2 text-white transition-colors bg-blue-600 rounded-lg"
          style={{ backgroundColor: getCategoryColor(formData.category) }}
        >
          <Save className="w-4 h-4" />
           { !isLoading? expense ? 'Update Expense' : 'Save Expense' : "Loading..."}
        </button>
      </div>
    </form>
  );
};

export default ExpenseForm;