import { User, LogOut, Bell, Palette, HelpCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import BottomNav from '@/components/BottomNav';

const SettingsPage = () => {
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

        <Button variant="outline" className="w-full mt-4 text-destructive border-destructive/30">
          <LogOut className="w-4 h-4 mr-2" /> Sign Out
        </Button>
      </div>

      <BottomNav />
    </div>
  );
};

export default SettingsPage;
