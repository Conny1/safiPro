import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  addOrder,
  Branch,
  createAccount,
  createBranch,
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
  tagTypes: ["User", "Order", "Branch"],
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
    }),

    getauthuser: build.query<{ status: Number; data: user }, void>({
      query: () => "/admin/user/auth-user/",
    }),

    findAndFilterUser: build.mutation<
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

    getBranchNamesByuserId: build.query<
      { status: Number; data: Branch[] },
      string
    >({
      query: (id) => `/admin/branch/branch/${id}`,
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
    }),

    getOrderById: build.query<{ status: Number; data: Order }, string>({
      query: (id) => `/admin/orders/${id}`,
    }),

    getOrderDashbardAnalysis: build.query<
      {
        status: Number;
        data: {
          total_orders: number;
          completed_orders: number;
          total_revenue: number;
        };
      },
      string
    >({
      query: (id) => `/admin/orders/dashboard/${id}`,
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
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useCreateAccountMutation,
  useGetauthuserQuery,
  useUpdateuserMutation,
  useLoginMutation,
  useAddnewBranchMutation,
  useFindAndFilterBranchMutation,
  useGetBranchByIdQuery,
  useUpdateBranchMutation,
  useCreateNewOrderMutation,
  useFindAndFilterOrderMutation,
  useGetOrderByIdQuery,
  useUpdateOrderMutation,
  useGetBranchNamesByuserIdQuery,
  useCreateStaffAccountMutation,
  useFindAndFilterUserMutation,
  useDeleteBranchMutation,
  useDeleteOrderMutation,
  useDeleteUserMutation,
  useFindAndFilterPaymentMutation,
  useMpesaPaymentMutation,
  useGetOrderDashbardAnalysisQuery,
} = laundryApi;
