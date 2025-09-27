import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, GraduationCap, Users, BookOpen, Award } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Login = () => {
  const [idNumber, setIdNumber] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const { login, isAuthenticated, isLoading } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!idNumber.trim() || !username.trim()) {
      setError('Please enter both ID number and username');
      return;
    }

    const success = await login(idNumber.trim(), username.trim());
    
    if (!success) {
      setError('Invalid credentials. Please check your ID number and username.');
      toast({
        title: "Login Failed",
        description: "Invalid credentials provided.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Login Successful",
        description: "Welcome to your university application portal!",
      });
    }
  };

  const demoCredentials = [
    { id: "0123456789", username: "thabo.molefe", name: "Thabo Molefe" },
    { id: "9876543210", username: "sarah.johnson", name: "Sarah Johnson" },
    { id: "1234567890", username: "aisha.patel", name: "Aisha Patel" },
    { id: "5555555555", username: "mike.van.der.merwe", name: "Mike van der Merwe" },
    { id: "7777777777", username: "fatima.ndlovu", name: "Fatima Ndlovu" }
  ];

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Hero content */}
        <div className="text-white space-y-8 text-center lg:text-left">
          <div className="space-y-4">
            <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
              <GraduationCap className="w-12 h-12" />
              <h1 className="text-4xl font-bold">UniMatch</h1>
            </div>
            <h2 className="text-3xl lg:text-5xl font-bold leading-tight">
              Find Your Perfect University Match
            </h2>
            <p className="text-xl text-white/80 max-w-lg">
              Discover which courses you qualify for, manage university offers, and find scholarships - all in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <Users className="w-8 h-8 mx-auto mb-2 text-white/80" />
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-white/70">Universities</div>
            </div>
            <div className="space-y-2">
              <BookOpen className="w-8 h-8 mx-auto mb-2 text-white/80" />
              <div className="text-2xl font-bold">6+</div>
              <div className="text-sm text-white/70">Courses</div>
            </div>
            <div className="space-y-2">
              <Award className="w-8 h-8 mx-auto mb-2 text-white/80" />
              <div className="text-2xl font-bold">3</div>
              <div className="text-sm text-white/70">Scholarships</div>
            </div>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="w-full max-w-md mx-auto">
          <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl font-bold text-center">Student Login</CardTitle>
              <CardDescription className="text-center">
                Enter your ID number and username to access your portal
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="idNumber">ID Number</Label>
                  <Input
                    id="idNumber"
                    type="text"
                    placeholder="e.g., 0123456789"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    disabled={isLoading}
                    className="h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="e.g., john.doe"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    disabled={isLoading}
                    className="h-11"
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                <Button
                  type="submit"
                  className="w-full h-11 bg-gradient-primary hover:opacity-90"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              <div className="mt-6 pt-4 border-t">
                <p className="text-sm text-muted-foreground mb-3 text-center font-medium">
                  Demo Credentials:
                </p>
                <div className="grid gap-2 text-xs">
                  {demoCredentials.slice(0, 3).map((cred) => (
                    <div
                      key={cred.id}
                      className="flex justify-between items-center p-2 rounded bg-muted/50 cursor-pointer hover:bg-muted transition-colors"
                      onClick={() => {
                        setIdNumber(cred.id);
                        setUsername(cred.username);
                      }}
                    >
                      <span className="font-medium text-foreground">{cred.name}</span>
                      <div className="text-right text-muted-foreground">
                        <div>{cred.id}</div>
                        <div>{cred.username}</div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-center">
                  Click any credential to auto-fill
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;