import { useState } from 'react';
import { User, LogOut, Bell, Palette, HelpCircle, Mail, Lock, Check } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import BottomNav from '@/components/BottomNav';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const SettingsPage = () => {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleChangePassword = async () => {
    if (newPassword.length < 6) {
      toast({ title: 'Error', description: 'Password must be at least 6 characters.', variant: 'destructive' });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: 'Error', description: 'Passwords do not match.', variant: 'destructive' });
      return;
    }
    setChangingPassword(true);
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Done', description: 'Password updated successfully.' });
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordForm(false);
    }
    setChangingPassword(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="pt-12 pb-6 px-6">
        <div className="flex items-center gap-3 mb-2">
          <User className="w-6 h-6 text-primary" />
          <h1 className="text-3xl font-display font-bold">Settings</h1>
        </div>
        <p className="text-muted-foreground text-sm">Manage your account & preferences</p>
      </div>

      <div className="flex-1 px-6 space-y-4 pb-28">
        {/* Account section */}
        <Card className="p-5 bg-card border-border space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="w-4 h-4 text-muted-foreground" />
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Signed in as</p>
              <p className="text-sm font-medium truncate">{user?.email ?? '—'}</p>
            </div>
          </div>
          <Separator />
          {!showPasswordForm ? (
            <button
              onClick={() => setShowPasswordForm(true)}
              className="flex items-center gap-3 w-full text-left"
            >
              <Lock className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Change Password</span>
            </button>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3 mb-1">
                <Lock className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Change Password</span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-pw" className="text-xs text-muted-foreground">New Password</Label>
                <Input
                  id="new-pw"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="bg-muted border-border"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-pw" className="text-xs text-muted-foreground">Confirm Password</Label>
                <Input
                  id="confirm-pw"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="bg-muted border-border"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={handleChangePassword}
                  disabled={changingPassword}
                  className="flex-1"
                >
                  <Check className="w-3 h-3 mr-1" />
                  {changingPassword ? 'Saving...' : 'Update'}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => { setShowPasswordForm(false); setNewPassword(''); setConfirmPassword(''); }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </Card>

        <Card className="p-5 bg-card border-border space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Notifications</span>
            </div>
            <Switch />
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Dark Mode</span>
            </div>
            <Switch defaultChecked />
          </div>
        </Card>

        <Card className="p-5 bg-card border-border">
          <div className="flex items-center gap-3">
            <HelpCircle className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-medium">Help & Support</span>
          </div>
        </Card>

        <Button
          variant="outline"
          className="w-full mt-4 text-destructive border-destructive/30"
          onClick={handleSignOut}
        >
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default SettingsPage;
