import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight } from 'lucide-react';
import logo from '@/assets/logo.png';
import wineryBg from '@/assets/winery-bg.jpg';
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
    <div className="min-h-screen relative flex items-center justify-center px-4">
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat -z-20"
        style={{ backgroundImage: `url(${wineryBg})` }}
      />
      <div className="fixed inset-0 bg-black/40 -z-10" />

      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-md mb-2">
            <img src={logo} alt="Terroir logo" className="w-10 h-10" />
          </div>
          <h1 className="text-4xl font-display font-bold tracking-tight text-white drop-shadow-lg">Cellar</h1>
          <p className="text-white/70 font-sans">
            Your personal wine collection, beautifully organized.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 bg-white/10 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-2xl">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-sans text-white/80">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-sans text-white/80">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:border-white/40"
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Please wait...' : isSignUp ? 'Create Account' : 'Sign In'}
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </form>

        <p className="text-center text-sm text-white/60 font-sans">
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
