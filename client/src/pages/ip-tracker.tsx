import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Globe, 
  Network, 
  MapPin, 
  Building, 
  Shield, 
  Info, 
  RefreshCw, 
  Download, 
  Share2, 
  History, 
  Copy,
  CheckCircle,
  XCircle,
  AlertCircle,
  Search,
  Menu,
  ChevronDown,
  Home,
  BarChart3,
  Settings,
  HelpCircle,
  User
} from "lucide-react";
import { type IPInfo } from "@shared/schema";
import { useState } from "react";
import RecentLookups from "@/components/recent-lookups";
import LocationMap from "@/components/location-map";

export default function IPTracker() {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { data: ipInfo, isLoading, error, refetch } = useQuery<IPInfo>({
    queryKey: ['/api/ip-info'],
    refetchInterval: false,
    refetchOnWindowFocus: false,
    retry: 3,
  });

  const handleCopy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        description: `${label} has been copied to your clipboard.`,
      });
    } catch (error) {
      toast({
        title: "Copy failed",
        description: "Failed to copy to clipboard. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await refetch();
      toast({
        title: "Data refreshed",
        description: "Your IP information has been updated.",
      });
    } catch (error) {
      toast({
        title: "Refresh failed",
        description: "Failed to refresh data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleExport = () => {
    if (ipInfo) {
      const dataStr = JSON.stringify(ipInfo, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      const exportFileDefaultName = 'ip-info.json';
      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
    }
  };

  const AdPlaceholder = ({ side }: { side: 'left' | 'right' }) => (
    <div className="hidden xl:block w-40 p-4">
      <div className="bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-2 border-dashed border-blue-200 dark:border-blue-700 rounded-lg h-[600px] flex flex-col items-center justify-center sticky top-4 shadow-sm">
        <div className="text-center p-4">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-800 rounded-full flex items-center justify-center mb-4 mx-auto">
            <BarChart3 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h3 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-2">Advertisement</h3>
          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Your ad could be here</p>
          <div className="text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded px-2 py-1 border">
            160×600
          </div>
          <div className="mt-4 space-y-2">
            <div className="h-2 bg-blue-200 dark:bg-blue-700 rounded animate-pulse"></div>
            <div className="h-2 bg-purple-200 dark:bg-purple-700 rounded animate-pulse"></div>
            <div className="h-2 bg-blue-200 dark:bg-blue-700 rounded animate-pulse"></div>
          </div>
          <Button variant="outline" size="sm" className="mt-4 text-xs">
            Learn More
          </Button>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Top Navigation Bar - Alinta Style */}
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo and Brand */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center relative shadow-lg">
                  <Globe className="h-5 w-5 text-white" />
                  <Search className="h-3 w-3 text-white absolute -top-1 -right-1 bg-orange-500 rounded-full p-0.5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Your IP</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">IP Address Tracker</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </a>
                <a href="#" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </a>
                <a href="#" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <History className="h-4 w-4" />
                  <span>History</span>
                </a>
                <a href="#" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <HelpCircle className="h-4 w-4" />
                  <span>Help</span>
                </a>
              </div>

              {/* User Account & Mobile Menu */}
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="hidden md:flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>My Account</span>
                </Button>
                
                <button 
                  className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
                <div className="space-y-2">
                  <a href="#" className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <History className="h-4 w-4" />
                    <span>History</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <HelpCircle className="h-4 w-4" />
                    <span>Help</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </nav>

        <main className="flex">
          <AdPlaceholder side="left" />

          {/* Main Content */}
          <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">Detecting your IP address and location...</p>
              </div>
            </div>
          </div>

          <AdPlaceholder side="right" />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Top Navigation Bar - Alinta Style */}
        <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo and Brand */}
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center relative shadow-lg">
                  <Globe className="h-5 w-5 text-white" />
                  <Search className="h-3 w-3 text-white absolute -top-1 -right-1 bg-orange-500 rounded-full p-0.5" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">Your IP</h1>
                  <p className="text-xs text-gray-500 dark:text-gray-400">IP Address Tracker</p>
                </div>
              </div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </a>
                <a href="#" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </a>
                <a href="#" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <History className="h-4 w-4" />
                  <span>History</span>
                </a>
                <a href="#" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <HelpCircle className="h-4 w-4" />
                  <span>Help</span>
                </a>
              </div>

              {/* User Account & Mobile Menu */}
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm" className="hidden md:flex items-center space-x-2">
                  <User className="h-4 w-4" />
                  <span>My Account</span>
                </Button>
                
                <button 
                  className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                >
                  <Menu className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
              <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
                <div className="space-y-2">
                  <a href="#" className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <Home className="h-4 w-4" />
                    <span>Home</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <History className="h-4 w-4" />
                    <span>History</span>
                  </a>
                  <a href="#" className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                    <HelpCircle className="h-4 w-4" />
                    <span>Help</span>
                  </a>
                </div>
              </div>
            )}
          </div>
        </nav>

        <main className="flex">
          <AdPlaceholder side="left" />

          {/* Main Content */}
          <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <Card className="w-full max-w-md">
                <CardContent className="pt-6">
                  <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Failed to Load IP Information</h2>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      We couldn't retrieve your IP information. Please check your connection and try again.
                    </p>
                    <Button onClick={handleRefresh} disabled={isRefreshing}>
                      <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                      Try Again
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <AdPlaceholder side="right" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar - Alinta Style */}
      <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center relative shadow-lg">
                <Globe className="h-5 w-5 text-white" />
                <Search className="h-3 w-3 text-white absolute -top-1 -right-1 bg-orange-500 rounded-full p-0.5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Your IP</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">IP Address Tracker</p>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="flex items-center space-x-1 text-blue-600 dark:text-blue-400 font-medium">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </a>
              <a href="#analytics" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </a>
              <a href="#history" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <History className="h-4 w-4" />
                <span>History</span>
              </a>
              <a href="#help" className="flex items-center space-x-1 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <HelpCircle className="h-4 w-4" />
                <span>Help</span>
              </a>
            </div>

            {/* User Account & Mobile Menu */}
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="hidden md:flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20">
                <User className="h-4 w-4" />
                <span>My Account</span>
              </Button>
              
              <button 
                className="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 dark:border-gray-700 py-4">
              <div className="space-y-2">
                <a href="#" className="flex items-center space-x-2 px-4 py-2 text-blue-600 dark:text-blue-400 font-medium bg-blue-50 dark:bg-blue-900/20 rounded-md">
                  <Home className="h-4 w-4" />
                  <span>Home</span>
                </a>
                <a href="#analytics" className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                  <BarChart3 className="h-4 w-4" />
                  <span>Analytics</span>
                </a>
                <a href="#history" className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                  <History className="h-4 w-4" />
                  <span>History</span>
                </a>
                <a href="#help" className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md">
                  <HelpCircle className="h-4 w-4" />
                  <span>Help</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section - Alinta Style */}
      <div className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Discover Your IP Information
          </h1>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get comprehensive details about your IP address, location, and network connection with our advanced tracking technology.
          </p>
          <div className="flex items-center justify-center space-x-4">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg px-6 py-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="font-medium">Live Detection Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex">
        <AdPlaceholder side="left" />

        {/* Main Content */}
        <div className="flex-1 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Status Banner */}
          <div className="mb-8">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-green-700 dark:text-green-300 font-medium">Connected</span>
              <span className="text-gray-600 dark:text-gray-300">Your IP information has been detected successfully</span>
            </div>
          </div>

          {/* IP Address Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* IPv4 Card */}
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Globe className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">IPv4 Address</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Internet Protocol version 4</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCopy(ipInfo?.ip || '', 'IPv4 address')}
                    className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-xl p-4 border border-blue-100 dark:border-blue-800">
                  <div className="font-mono text-2xl font-bold text-gray-900 dark:text-white">{ipInfo?.ip || 'Not available'}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Public IP Address</div>
                </div>
              </CardContent>
            </Card>

            {/* IPv6 Card */}
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                      <Network className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white">IPv6 Address</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Internet Protocol version 6</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleCopy(ipInfo?.ipv6 || '', 'IPv6 address')}
                    disabled={!ipInfo?.ipv6}
                    className="hover:bg-purple-50 hover:border-purple-300 dark:hover:bg-purple-900/20"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 border border-purple-100 dark:border-purple-800">
                  <div className="font-mono text-lg font-bold text-gray-900 dark:text-white break-all">
                    {ipInfo?.ipv6 || 'Not available'}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Public IPv6 Address</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Location Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Location Details Card */}
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <MapPin className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Geographic Location</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Based on your IP address</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">City</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{ipInfo?.city || 'Not available'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Region</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{ipInfo?.region || 'Not available'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Country</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{ipInfo?.country || 'Not available'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Postal Code</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{ipInfo?.postalCode || 'Not available'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Coordinates</span>
                    <span className="text-sm font-mono text-gray-900 dark:text-white">
                      {ipInfo?.latitude && ipInfo?.longitude 
                        ? `${ipInfo.latitude}, ${ipInfo.longitude}` 
                        : 'Not available'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Timezone</span>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white">{ipInfo?.timezone || 'Not available'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Interactive Map Card */}
            <LocationMap 
              latitude={ipInfo?.latitude}
              longitude={ipInfo?.longitude}
              city={ipInfo?.city}
              region={ipInfo?.region}
              country={ipInfo?.country}
            />
          </div>

          {/* ISP and Additional Info Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* ISP Information Card */}
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Building className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">ISP Information</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Internet Service Provider</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Provider</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{ipInfo?.isp || 'Not available'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Organization</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{ipInfo?.organization || 'Not available'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">AS Number</div>
                    <div className="text-sm font-mono text-gray-900 dark:text-white">{ipInfo?.asn || 'Not available'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Connection Type</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{ipInfo?.connectionType || 'Not available'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Security Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Security Status Card */}
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Shield className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Security Status</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">IP reputation and security checks</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Threat Level</span>
                    <Badge variant={ipInfo?.threatLevel === 'clean' ? 'default' : 'destructive'} className="bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      {ipInfo?.threatLevel || 'Unknown'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Proxy/VPN</span>
                    <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      <XCircle className="h-3 w-3 mr-1" />
                      {ipInfo?.vpn ? 'Detected' : 'Not Detected'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-700">
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Tor Exit Node</span>
                    <Badge variant="secondary" className="bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                      <XCircle className="h-3 w-3 mr-1" />
                      {ipInfo?.tor ? 'Detected' : 'Not Detected'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Additional Information Card */}
            <Card className="overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                    <Info className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Additional Information</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Extra details about your connection</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Currency</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{ipInfo?.currency || 'Not available'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Calling Code</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{ipInfo?.callingCode || 'Not available'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Language</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{ipInfo?.language || 'Not available'}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">User Agent</div>
                    <div className="text-sm font-semibold text-gray-900 dark:text-white">{ipInfo?.userAgent || 'Not available'}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <Button onClick={handleRefresh} disabled={isRefreshing} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <Button variant="outline" onClick={handleExport} className="hover:bg-blue-50 hover:border-blue-300 dark:hover:bg-blue-900/20">
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
          </div>

          {/* Recent Lookups Section */}
          <div id="history" className="mb-8">
            <RecentLookups />
          </div>
        </div>

        <AdPlaceholder side="right" />
      </main>

      {/* Footer - Alinta Style */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Your IP</h3>
                  <p className="text-gray-400 text-sm">Advanced IP Address Tracking</p>
                </div>
              </div>
              <p className="text-gray-400 mb-4">
                Get comprehensive IP address information including location, ISP details, and security analysis with our professional tracking service.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">IP Tracking</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Location Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security Analysis</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Network Information</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 Your IP. All rights reserved. | Privacy Policy | Terms of Service</p>
          </div>
        </div>
      </footer>
    </div>
  );
}