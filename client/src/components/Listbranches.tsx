import React, { useEffect, useState } from "react";
import type { Branch, pagination } from "../types";
import {
  useDeleteBranchMutation,
  useFindAndFilterBranchMutation,
  useUpdateBranchMutation,
} from "../redux/apislice";
import { toast } from "react-toastify";
import {
  Building,
  MapPin,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit2,
  Save,
  X,
  Loader2,
} from "lucide-react";

type Props = {
  setlisbranchesModal: React.Dispatch<React.SetStateAction<boolean>>;
};

const Listbranches = ({ setlisbranchesModal }: Props) => {
  const [localBranches, setLocalBranches] = useState<Branch[] | []>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingBranch, setEditingBranch] = useState<string | null>(null);
  const [editedBranch, setEditedBranch] = useState<Partial<Branch> | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [filterStatus] = useState("all");
    const [paginationdata, setpaginationdata] = useState<pagination>({
    page: 1,
    limit: 10,
    totalPages: 0,
    totalResults: 0,
  });

  const [findAndFilterBranch, { isLoading: fetchloading }] =
    useFindAndFilterBranchMutation();
  const [updateBranch, { isLoading: updateloading }] =
    useUpdateBranchMutation();
  const [deleteBranch, { isLoading: deleteLoading }] =
    useDeleteBranchMutation();

  const fetchBranches = () => {
    const filters: any = {
      match_values: {  },
      sortBy: "_id:-1",
      limit: paginationdata.limit,
      page: paginationdata.page,
      search: searchTerm || "",
    };

    if (filterStatus !== "all") {
      filters.match_values.status = filterStatus;
    }

    findAndFilterBranch(filters)
      .then((resp) => {
        if (resp.data?.status === 200) {
          setLocalBranches(resp.data.data.results);
          setpaginationdata({
            page: resp.data.data.page || 1,
            limit: resp.data.data.limit || 10,
            totalPages: resp.data.data.totalPages || 0,
            totalResults: resp.data.data.totalResults || 0,
          });
        } else {
          setLocalBranches([]);
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error("Failed to fetch branches");
      });
  };

  useEffect(() => {
    fetchBranches();
  }, [paginationdata.page, searchTerm, filterStatus]);

  const handleEdit = (branch: Branch) => {
    setEditingBranch(branch._id as string);
    setEditedBranch({ ...branch });
  };

  const handleEditChange = (field: keyof Branch, value: string) => {
    if (editedBranch) {
      setEditedBranch(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSaveBranch = async (branchId: string) => {
    if (!editedBranch) return;
    
    try {
      const resp = await updateBranch({ _id: branchId, ...editedBranch });
      if (resp.data?.status === 200) {
        toast.success("Branch updated successfully");
        setEditingBranch(null);
        setEditedBranch(null);
        fetchBranches();
      } else {
        toast.error("Failed to update branch");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  const handleCancelEdit = () => {
    setEditingBranch(null);
    setEditedBranch(null);
  };

  const handleDeleteBranch = async (branchId: string) => {
    try {
      const resp = await deleteBranch(branchId);
      if (resp.data?.status === 200) {
        toast.success("Branch deleted successfully");
        setShowDeleteConfirm(null);
        fetchBranches();
      } else {
        toast.error("Failed to delete branch");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  // const getStatusColor = (status: string) => {
  //   switch (status?.toLowerCase()) {
  //     case "active":
  //       return "bg-green-100 text-green-800 border-green-200";
  //     case "inactive":
  //       return "bg-gray-100 text-gray-800 border-gray-200";
  //     case "pending":
  //       return "bg-yellow-100 text-yellow-800 border-yellow-200";
  //     default:
  //       return "bg-blue-100 text-blue-800 border-blue-200";
  //   }
  // };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Branch Management</h2>
            <p className="text-gray-600">Manage all your laundry business locations</p>
          </div>
          <button
            onClick={() => setlisbranchesModal(false)}
            className="p-2 text-gray-400 transition-colors rounded-lg hover:text-gray-600 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters & Search */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="relative flex-1">
              <Search className="absolute w-4 h-4 text-gray-400 transform -translate-y-1/2 left-3 top-1/2" />
              <input
                type="text"
                placeholder="Search branches by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="pending">Pending</option>
            </select> */}
            
            <button
              onClick={fetchBranches}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Refresh
            </button>
{/*             
            <button className="px-4 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg hover:from-blue-700 hover:to-blue-800 flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button> */}
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-600">
              Showing {localBranches.length} of {paginationdata.totalResults} branches
            </p>
            <div className="text-sm text-gray-600">
              Page {paginationdata.page} of {paginationdata.totalPages}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {fetchloading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader2 className="w-12 h-12 mb-4 text-blue-600 animate-spin" />
              <p className="text-gray-600">Loading branches...</p>
            </div>
          ) : localBranches.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Building className="w-16 h-16 mb-4 text-gray-300" />
              <h3 className="mb-2 text-lg font-medium text-gray-900">No branches found</h3>
              <p className="text-gray-600">Try adjusting your search or add a new branch</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              {localBranches.map((branch) => (
                <div
                  key={branch._id}
                  className="transition-all duration-300 bg-white border border-gray-200 rounded-xl hover:shadow-lg"
                >
                  {/* Branch Header */}
                  <div className="p-5 border-b border-gray-200">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-3 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
                          <Building className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">
                            {editingBranch === branch._id ? (
                              <input
                                type="text"
                                value={editedBranch?.name || ""}
                                onChange={(e) => handleEditChange("name", e.target.value)}
                                className="w-full max-w-xs px-3 py-1 border border-gray-300 rounded"
                                placeholder="Branch name"
                              />
                            ) : (
                              branch.name
                            )}
                          </h3>
                          {/* <div className="flex items-center gap-4 mt-1">
                            <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(branch.status || "active")}`}>
                              {branch.status === "active" && <CheckCircle className="w-3 h-3" />}
                              {branch.status || "Active"}
                            </span>
                            <span className="text-sm text-gray-500">
                              ID: {branch._id?.substring(0, 8)}...
                            </span>
                          </div> */}
                        </div>
                      </div>
                      
                      {showDeleteConfirm === branch._id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-gray-600">Are you sure?</span>
                          <button
                            onClick={() => handleDeleteBranch(branch._id as string)}
                            disabled={deleteLoading}
                            className="px-3 py-1 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-50"
                          >
                            {deleteLoading ? "Deleting..." : "Yes"}
                          </button>
                          <button
                            onClick={() => setShowDeleteConfirm(null)}
                            className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                          >
                            No
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {editingBranch === branch._id ? (
                            <>
                              <button
                                onClick={() => handleSaveBranch(branch._id as string)}
                                disabled={updateloading}
                                className="p-2 text-green-600 transition-colors rounded-lg hover:text-green-700 hover:bg-green-50"
                              >
                                {updateloading ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Save className="w-4 h-4" />
                                )}
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-2 text-gray-600 transition-colors rounded-lg hover:text-gray-700 hover:bg-gray-100"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => handleEdit(branch)}
                                className="p-2 text-blue-600 transition-colors rounded-lg hover:text-blue-700 hover:bg-blue-50"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => setShowDeleteConfirm(branch._id as string)}
                                className="p-2 text-red-600 transition-colors rounded-lg hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Branch Details */}
                  <div className="p-5">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <MapPin className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <label className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Location
                          </label>
                          {editingBranch === branch._id ? (
                            <input
                              type="text"
                              value={editedBranch?.location || ""}
                              onChange={(e) => handleEditChange("location", e.target.value)}
                              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded"
                              placeholder="Branch location"
                            />
                          ) : (
                            <p className="text-gray-900">{branch.location || "Not specified"}</p>
                          )}
                        </div>
                      </div>
{/* 
                      <div className="flex items-start gap-3">
                        <Phone className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <label className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Contact Phone
                          </label>
                          {editingBranch === branch._id ? (
                            <input
                              type="tel"
                              value={editedBranch?.contact_phone || ""}
                              onChange={(e) => handleEditChange("contact_phone", e.target.value)}
                              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded"
                              placeholder="Contact phone"
                            />
                          ) : (
                            <p className="text-gray-900">{branch.contact_phone || "Not specified"}</p>
                          )}
                        </div>
                      </div> */}

                      {/* <div className="flex items-start gap-3">
                        <Mail className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <label className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Contact Email
                          </label>
                          {editingBranch === branch._id ? (
                            <input
                              type="email"
                              value={editedBranch?.contact_email || ""}
                              onChange={(e) => handleEditChange("contact_email", e.target.value)}
                              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded"
                              placeholder="Contact email"
                            />
                          ) : (
                            <p className="text-gray-900">{branch.contact_email || "Not specified"}</p>
                          )}
                        </div>
                      </div> */}

                      {/* <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <label className="text-xs font-medium tracking-wider text-gray-500 uppercase">
                            Manager
                          </label>
                          {editingBranch === branch._id ? (
                            <input
                              type="text"
                              value={editedBranch?.manager_name || ""}
                              onChange={(e) => handleEditChange("manager_name", e.target.value)}
                              className="w-full px-3 py-2 mt-1 border border-gray-300 rounded"
                              placeholder="Manager name"
                            />
                          ) : (
                            <p className="text-gray-900">{branch.manager_name || "Not assigned"}</p>
                          )}
                        </div>
                      </div> */}
                    </div>

                    {/* Branch Stats */}
                    {/* <div className="pt-6 mt-6 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-3 text-center rounded-lg bg-gray-50">
                          <p className="text-sm text-gray-600">Active Staff</p>
                          <p className="text-xl font-bold text-gray-900">5</p>
                        </div>
                        <div className="p-3 text-center rounded-lg bg-gray-50">
                          <p className="text-sm text-gray-600">Today's Orders</p>
                          <p className="text-xl font-bold text-gray-900">24</p>
                        </div>
                      </div>
                    </div> */}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <div className="text-sm text-gray-600">
              Showing {localBranches.length} of {paginationdata.totalResults} results
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setpaginationdata(prev => ({
                  ...prev,
                  page: Math.max(1, prev.page - 1)
                }))}
                disabled={paginationdata.page === 1 || fetchloading}
                className="p-2 text-gray-600 border border-gray-300 rounded-lg hover:text-gray-900 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, paginationdata.totalPages))].map((_, i) => {
                  const pageNum = i + 1;
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setpaginationdata(prev => ({ ...prev, page: pageNum }))}
                      className={`w-10 h-10 flex items-center justify-center rounded-lg transition-colors ${
                        paginationdata.page === pageNum
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                {paginationdata.totalPages > 5 && (
                  <span className="px-2 text-gray-400">...</span>
                )}
              </div>
              
              <button
                onClick={() => setpaginationdata(prev => ({
                  ...prev,
                  page: Math.min(paginationdata.totalPages, prev.page + 1)
                }))}
                disabled={paginationdata.page === paginationdata.totalPages || fetchloading}
                className="p-2 text-gray-600 border border-gray-300 rounded-lg hover:text-gray-900 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={paginationdata.limit}
                onChange={(e) => setpaginationdata(prev => ({
                  ...prev,
                  limit: parseInt(e.target.value),
                  page: 1
                }))}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg"
              >
                <option value="5">5 per page</option>
                <option value="10">10 per page</option>
                <option value="25">25 per page</option>
                <option value="50">50 per page</option>
              </select>
              
              <button
                onClick={() => setlisbranchesModal(false)}
                className="px-6 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listbranches;