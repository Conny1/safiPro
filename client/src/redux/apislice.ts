import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  addExpenseType,
  addOrder,
  AnalysisData,
  Branch,
  createAccount,
  createBranch,
  Expense,
  findandfilter,
  login,
  mobilePayments,
  Order,
  pagination,
  Payment,
  user,
} from "../types";
import type { RootState } from "./store";

// Define a service using a base URL and expected endpoints
export const laundryApi = createApi({
  reducerPath: "laundryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).user.value.token; // Access token from Redux state
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["User", "Order", "Branch", "Expense", "Staff"],
  endpoints: (build) => ({
    createAccount: build.mutation<
      {
        status: Number;
      },
      createAccount
    >({
      query: (body) => ({
        url: "/admin/user/signup",
        method: "POST",
        body,
      }),
    }),

    createStaffAccount: build.mutation<
      {
        status: Number;
      },
      createAccount
    >({
      query: (body) => ({
        url: "/admin/user/create-staff",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Staff"],
    }),

    login: build.mutation<
      {
        status: Number;
        data: user;
      },
      login
    >({
      query: (body) => ({
        url: "/admin/user/login",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    updateuser: build.mutation<
      {
        status: Number;
        data: user;
      },
      user
    >({
      query: (body) => ({
        url: `/admin/user/${body._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Staff", "User"],
    }),

    getauthuser: build.query<{ status: Number; data: user }, void>({
      query: () => "/admin/user/auth-user/",
      providesTags: ["User"],
    }),

    findAndFilterUser: build.query<
      {
        status: Number;
        data: { results: user[] } & pagination;
      },
      findandfilter
    >({
      query: (body) => ({
        url: "/admin/user/findandfilter",
        method: "POST",
        body,
      }),
      providesTags: ["Staff"],
    }),
    deleteUser: build.mutation<
      {
        status: Number;
      },
      string
    >({
      query: (id) => ({
        url: `/admin/user/${id}`,
        method: "DELETE",
      }),
    }),
    resetPassword: build.mutation<
      {
        status: Number;
      },
      { token: string; password: string }
    >({
      query: ({ token, ...body }) => ({
        url: `/admin/user/reset-password`,
        method: "POST",
        body,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),

    // BRANCH ROUTES

    addnewBranch: build.mutation<
      {
        status: Number;
      },
      createBranch
    >({
      query: (body) => ({
        url: "/admin/branch",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Branch"],
    }),

    updateBranch: build.mutation<
      {
        status: Number;
        data: Branch;
      },
      Branch
    >({
      query: (body) => ({
        url: `/admin/branch/${body?._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Branch"],
    }),

    getBranchById: build.query<{ status: Number; data: Branch }, string>({
      query: (id) => `/admin/branch/${id}`,
      providesTags: ["Branch"],
    }),

    findAndFilterBranch: build.mutation<
      {
        status: Number;
        data: { results: Branch[] } & pagination;
      },
      findandfilter
    >({
      query: (body) => ({
        url: "/admin/branch/findandfilter",
        method: "POST",
        body,
      }),
    }),

    getBranchNamesByBusiness: build.query<
      { status: Number; data: Branch[] },
      void
    >({
      query: () => `/admin/branch/list/business`,
      providesTags: ["Branch"],
    }),
    deleteBranch: build.mutation<
      {
        status: Number;
      },
      string
    >({
      query: (id) => ({
        url: `/admin/branch/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Branch"],
    }),

    // ORDERS
    createNewOrder: build.mutation<
      {
        status: Number;
      },
      addOrder
    >({
      query: (body) => ({
        url: "/admin/orders",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    updateOrder: build.mutation<
      {
        status: Number;
        data: Order;
      },
      Order
    >({
      query: (body) => ({
        url: `/admin/orders/${body?._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Order"],
    }),

    deleteOrderItem: build.mutation<
      {
        status: Number;
        data: Order;
      },
      {id:string, _id:string}
    >({
      query: (body) => ({
        url: `/admin/orders/delete/item/${body?._id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["Order"],
    }),

    getOrderById: build.query<{ status: Number; data: Order }, string>({
      query: (id) => `/admin/orders/${id}`,
      providesTags: ["Order"],
    }),

    findAndFilterOrder: build.mutation<
      {
        status: Number;
        data: { results: Order[] } & pagination;
      },
      findandfilter
    >({
      query: (body) => ({
        url: "/admin/orders/findandfilter",
        method: "POST",
        body,
      }),
    }),

    deleteOrder: build.mutation<
      {
        status: Number;
      },
      string
    >({
      query: (id) => ({
        url: `/admin/orders/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

    // PAYMENTS
    findAndFilterPayment: build.mutation<
      {
        status: Number;
        data: { results: Payment[] } & pagination;
      },
      findandfilter
    >({
      query: (body) => ({
        url: "/admin/payment/findandfilter",
        method: "POST",
        body,
      }),
    }),

    mpesaPayment: build.mutation<
      {
        status: boolean;
      },
      mobilePayments
    >({
      query: (body) => ({
        url: "/admin/payment/mobile/money",
        method: "POST",
        body,
      }),
    }),
    // Notifications
    sendResetLinkEmail: build.mutation<
      {
        status: Number;
      },
      { email: string }
    >({
      query: (body) => ({
        url: "/admin/notification/reset-password-link-email",
        method: "POST",
        body,
      }),
    }),

    // Expenses

    addnewExpense: build.mutation<
      {
        status: Number;
      },
      addExpenseType
    >({
      query: (body) => ({
        url: "/admin/expense",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Expense"],
    }),

    updateExpense: build.mutation<
      {
        status: Number;
        data: Expense;
      },
      Partial<Expense>
    >({
      query: (body) => ({
        url: `/admin/expense/${body?._id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Expense"],
    }),

    findAndFilterExpense: build.mutation<
      {
        status: Number;
        data: { results: Expense[] } & pagination;
      },
      findandfilter
    >({
      query: (body) => ({
        url: "/admin/expense/findandfilter",
        method: "POST",
        body,
      }),
    }),

    deleteExpense: build.mutation<
      {
        status: Number;
      },
      string
    >({
      query: (id) => ({
        url: `/admin/expense/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Expense"],
    }),
    // analysis
    getcompleteAnalysis: build.query<
      {
        status: Number;
        data: AnalysisData;
      },
      string
    >({
      query: (query: string) => ({
        url: `/admin/analysis/complete?${query}`,
      }),
      providesTags: ["Expense", "Order"],
    }),

  }),
});

export const {
  useCreateAccountMutation,
  useGetauthuserQuery,
  useUpdateuserMutation,
  useLoginMutation,
  useAddnewBranchMutation,
  useFindAndFilterBranchMutation,
  useGetBranchByIdQuery,
  useUpdateBranchMutation,
  // ORDERS
  useCreateNewOrderMutation,
  useFindAndFilterOrderMutation,
  useDeleteOrderItemMutation,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
  useGetBranchNamesByBusinessQuery,
  useCreateStaffAccountMutation,
  useFindAndFilterUserQuery,
  useDeleteBranchMutation,
  useDeleteOrderMutation,
  // 
  useDeleteUserMutation,
  useFindAndFilterPaymentMutation,
  useMpesaPaymentMutation,
  useSendResetLinkEmailMutation,
  useResetPasswordMutation,
  // expense
  useAddnewExpenseMutation,
  useUpdateExpenseMutation,
  useFindAndFilterExpenseMutation,
  useDeleteExpenseMutation,
  // analysis
  useGetcompleteAnalysisQuery,

} = laundryApi;
