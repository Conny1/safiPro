import { useState } from "react";
import { AddnewUser, ListStaff, Profile } from "../components";
import { USER_ROLES } from "../types";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import {
  User,
  Settings as SettingsIcon,
  Shield,
  Users,
  Bell,
  CreditCard,
  HelpCircle,
} from "lucide-react";

const Settings = () => {
  const [activeTab, setActiveTab] = useState<"profile" | "system" | "notifications" | "billing" | "security">("profile");
  const user = useSelector((state: RootState) => state.user.value);

  const tabs = [
    { id: "profile", label: "Profile", icon: User, available: true },
    { id: "security", label: "Security", icon: Shield, available: false },
    { id: "notifications", label: "Notifications", icon: Bell, available: false },
    { id: "system", label: "System", icon: SettingsIcon, available: user.role === USER_ROLES.SUPER_ADMIN },
    { id: "billing", label: "Billing", icon: CreditCard, available: false  },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
              <p className="text-gray-600">Manage your account and system preferences</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">
                Logged in as <span className="font-medium text-gray-900">{user.first_name}</span>
              </div>
              <div className="px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
                {user.role }
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 shadow-sm rounded-xl">
              <div className="p-6">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">Settings Menu</h2>
                <nav className="space-y-1">
                  {tabs
                    .filter(tab => tab.available)
                    .map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id as any)}
                          className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                            activeTab === tab.id
                              ? "bg-blue-50 text-blue-700 border border-blue-200"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          {tab.label}
                        </button>
                      );
                    })}
                </nav>
              </div>

              {/* Quick Stats */}
              <div className="p-6 border-t border-gray-200">
                <h3 className="mb-3 text-sm font-medium text-gray-700">Account Summary</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Branches</span>
                    <span className="text-sm font-medium text-gray-900">
                      {user.branches?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Active Since</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(user.createdAt ).toLocaleDateString('en-KE', { month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Plan</span>
                    <span className="text-sm font-medium text-green-600">Pro</span>
                  </div>
                </div>
              </div>

              {/* Support Section */}
              <div className="p-6 border-t border-gray-200">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-lg">
                  <HelpCircle className="w-4 h-4" />
                  Get Help & Support
                </button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="overflow-hidden bg-white border border-gray-200 shadow-sm rounded-xl">
              {/* Tab Content Header */}
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  {(() => {
                    const Icon = tabs.find(tab => tab.id === activeTab)?.icon || User;
                    return <Icon className="w-6 h-6 text-gray-600" />;
                  })()}
                  <h2 className="text-xl font-semibold text-gray-900">
                    {tabs.find(tab => tab.id === activeTab)?.label || "Profile"} Settings
                  </h2>
                </div>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "profile" && (
                  <div>
                    <Profile />
                  </div>
                )}

                {activeTab === "system" && user.role === USER_ROLES.SUPER_ADMIN && (
                  <div className="space-y-8">
             

                    {/* Staff Management */}
                    <div className="overflow-hidden border border-gray-200 rounded-xl">
                      <div className="p-6 border-b border-gray-200 bg-gray-50">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">Staff Management</h3>
                            <p className="text-sm text-gray-600">Add and manage system users</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="w-5 h-5 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {user.branches?.length || 0} active staff
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-6">
                        <AddnewUser />
                        <div className="mt-8">
                          <ListStaff />
                        </div>
                      </div>
                    </div>

                    {/* System Preferences */}
                    <div className="p-6 border border-gray-200 rounded-xl">
                      <h3 className="mb-4 text-lg font-semibold text-gray-900">System Preferences</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Automatic Backups</p>
                            <p className="text-sm text-gray-600">Daily backup at 2:00 AM</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">Email Notifications</p>
                            <p className="text-sm text-gray-600">Receive system alerts via email</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "security" && (
                  <div className="space-y-6">
                    <div className="p-6 border border-gray-200 rounded-xl">
                      <h3 className="mb-4 text-lg font-semibold text-gray-900">Security Settings</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block mb-2 text-sm font-medium text-gray-700">Change Password</label>
                          <div className="space-y-3">
                            <input
                              type="password"
                              placeholder="Current password"
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                              type="password"
                              placeholder="New password"
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                            <input
                              type="password"
                              placeholder="Confirm new password"
                              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <button className="px-4 py-2 mt-4 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700">
                            Update Password
                          </button>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-200">
                          <h4 className="mb-3 text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                            </div>
                            <button className="px-4 py-2 text-sm font-medium text-blue-600 rounded-lg bg-blue-50 hover:bg-blue-100">
                              Enable 2FA
                            </button>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-gray-200">
                          <h4 className="mb-3 text-sm font-medium text-gray-900">Session Management</h4>
                          <button className="px-4 py-2 text-sm font-medium text-red-600 rounded-lg bg-red-50 hover:bg-red-100">
                            Log out from all devices
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "notifications" && (
                  <div className="space-y-6">
                    <div className="p-6 border border-gray-200 rounded-xl">
                      <h3 className="mb-4 text-lg font-semibold text-gray-900">Notification Preferences</h3>
                      <div className="space-y-6">
                        <div>
                          <h4 className="mb-3 text-sm font-medium text-gray-900">Email Notifications</h4>
                          <div className="space-y-3">
                            <label className="flex items-center gap-3">
                              <input type="checkbox" className="text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                              <span className="text-sm text-gray-700">Order updates</span>
                            </label>
                            <label className="flex items-center gap-3">
                              <input type="checkbox" className="text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                              <span className="text-sm text-gray-700">Payment notifications</span>
                            </label>
                            <label className="flex items-center gap-3">
                              <input type="checkbox" className="text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                              <span className="text-sm text-gray-700">Marketing emails</span>
                            </label>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="mb-3 text-sm font-medium text-gray-900">SMS Notifications</h4>
                          <div className="space-y-3">
                            <label className="flex items-center gap-3">
                              <input type="checkbox" className="text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                              <span className="text-sm text-gray-700">Order ready alerts</span>
                            </label>
                            <label className="flex items-center gap-3">
                              <input type="checkbox" className="text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
                              <span className="text-sm text-gray-700">Promotional messages</span>
                            </label>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="mb-3 text-sm font-medium text-gray-900">Push Notifications</h4>
                          <div className="space-y-3">
                            <label className="flex items-center gap-3">
                              <input type="checkbox" className="text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                              <span className="text-sm text-gray-700">New orders</span>
                            </label>
                            <label className="flex items-center gap-3">
                              <input type="checkbox" className="text-blue-600 border-gray-300 rounded focus:ring-blue-500" defaultChecked />
                              <span className="text-sm text-gray-700">Low stock alerts</span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === "billing" && user.role === USER_ROLES.SUPER_ADMIN && (
                  <div className="space-y-6">
                    <div className="p-6 border border-gray-200 rounded-xl">
                      <h3 className="mb-4 text-lg font-semibold text-gray-900">Billing Information</h3>
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-gray-50">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-gray-900">Current Plan</p>
                              <p className="text-sm text-gray-600">Pro Plan - KES 1,000/month</p>
                            </div>
                            <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                              Active
                            </span>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="mb-3 text-sm font-medium text-gray-900">Payment Method</h4>
                          <div className="p-4 border border-gray-200 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <CreditCard className="w-5 h-5 text-gray-400" />
                                <div>
                                  <p className="font-medium text-gray-900">Visa ending in 4242</p>
                                  <p className="text-sm text-gray-600">Expires 12/2024</p>
                                </div>
                              </div>
                              <button className="text-sm text-blue-600 hover:text-blue-700">
                                Update
                              </button>
                            </div>
                          </div>
                        </div>
                        
                        <div>
                          <h4 className="mb-3 text-sm font-medium text-gray-900">Billing History</h4>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                              <span className="text-sm text-gray-700">December 2023</span>
                              <span className="text-sm font-medium text-gray-900">KES 1,000</span>
                            </div>
                            <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
                              <span className="text-sm text-gray-700">November 2023</span>
                              <span className="text-sm font-medium text-gray-900">KES 1,000</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;