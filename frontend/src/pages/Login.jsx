import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap, Settings, BookOpen, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Login = () => {
  const [selectedRole, setSelectedRole] = useState("admin");
  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("password");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const { login, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await login(email, password, selectedRole);
      navigate(`/${selectedRole}-dashboard`);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const roles = [
    { id: "admin", label: "Admin", icon: Settings },
    { id: "teacher", label: "Teacher", icon: BookOpen },
    { id: "student", label: "Student", icon: User },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="shadow-xl">
          <CardContent className="p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="text-2xl text-primary-foreground h-8 w-8" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground">
                School Management
              </h1>
              <p className="text-muted-foreground mt-2">
                Welcome back! Please sign in to your account
              </p>
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <Label className="block text-sm font-medium text-foreground mb-3">
                Select Role
              </Label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((role) => {
                  const Icon = role.icon;
                  return (
                    <Button
                      key={role.id}
                      type="button"
                      variant={selectedRole === role.id ? "default" : "outline"}
                      className={`p-3 h-auto flex-col ${
                        selectedRole === role.id
                          ? "bg-primary border-primary text-primary-foreground"
                          : "hover:border-primary hover:bg-primary/5"
                      }`}
                      onClick={() => setSelectedRole(role.id)}
                      data-testid={`button-role-${role.id}`}
                    >
                      <Icon className="h-5 w-5 mb-1" />
                      <span className="text-xs font-medium">{role.label}</span>
                    </Button>
                  );
                })}
              </div>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="relative">
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="peer pt-6 pb-2"
                    placeholder=" "
                    required
                    data-testid="input-email"
                  />
                  <Label
                    htmlFor="email"
                    className="absolute left-3 top-2 text-xs text-muted-foreground peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:text-xs peer-focus:top-2 transition-all duration-200"
                  >
                    Email Address
                  </Label>
                </div>

                <div className="relative">
                  <Input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="peer pt-6 pb-2"
                    placeholder=" "
                    required
                    data-testid="input-password"
                  />
                  <Label
                    htmlFor="password"
                    className="absolute left-3 top-2 text-xs text-muted-foreground peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:text-xs peer-focus:top-2 transition-all duration-200"
                  >
                    Password
                  </Label>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 mb-6">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={setRememberMe}
                    data-testid="checkbox-remember"
                  />
                  <Label
                    htmlFor="remember"
                    className="text-sm text-muted-foreground"
                  >
                    Remember me
                  </Label>
                </div>
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-primary hover:underline p-0 h-auto"
                  data-testid="link-forgot-password"
                >
                  Forgot password?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full"
                data-testid="button-signin"
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
