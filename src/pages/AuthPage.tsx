import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wine, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AuthPage = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { error } = isSignUp
      ? await signUp(email, password)
      : await signIn(email, password);

    if (error) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } else if (isSignUp) {
      toast({
        title: 'Account created',
        description: 'Check your email to confirm your account.',
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/20 mb-2">
            <Wine className="w-8 h-8 text-wine-gold" />
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight">Cellar</h1>
          <p className="text-muted-foreground font-sans">
            Your personal wine collection, beautifully organized.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-card p-8 rounded-xl border border-border">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-sans">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="bg-muted border-border"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-sans">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="bg-muted border-border"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground font-sans">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-wine-gold hover:underline font-medium"
          >
            {isSignUp ? 'Sign in' : 'Create one'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
