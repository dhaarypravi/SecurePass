import UserInfo from "@/components/UserInfo";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-gray-800 dark:text-white transition-colors duration-200">
              Secure Vault
            </h1>
            <div className="flex items-center space-x-4">
              {/* We'll handle session and signout in a separate client component */}
              <UserInfo />
            </div>
          </div>
        </div>
      </nav>
      {children}
    </div>
  );
}