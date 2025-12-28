import { useAuth } from "../contexts/AuthContext";
import { LogOut, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Navbar = ({ adminData }) => {
  const { logout } = useAuth();
  // console.log(adminData);

  return (
    <nav className="bg-card border-b border-border shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <GraduationCap className="text-primary-foreground h-5 w-5" />
            </div>
            <span className="ml-2 text-xl font-semibold text-foreground">
              School Management
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">
              Welcome,{" "}
              <span className="font-medium">
                {adminData?.fullName || adminData?.name || "User"}
              </span>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              data-testid="button-logout"
              className="text-muted-foreground hover:text-red-500 hover:bg-accent transition-all duration-300 ease-in-out group"
              title="Log out"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden group-hover:inline ml-0 mb-0.5 text-red-500 text-sm transition-all duration-1000 ease-in-out">
                Log out
              </span>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
