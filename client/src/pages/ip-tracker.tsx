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
  AlertCircle
} from "lucide-react";
import { type IPInfo } from "@shared/schema";
import { useState } from "react";

export default function IPTracker() {
  const { toast } = useToast();
  const [isRefreshing, setIsRefreshing] = useState(false);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Network className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">IP Tracker</h1>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-gray-600">Detecting your IP address and location...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Network className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900">IP Tracker</h1>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <Card className="w-full max-w-md">
              <CardContent className="pt-6">
                <div className="text-center">
                  <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                  <h2 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load IP Information</h2>
                  <p className="text-gray-600 mb-4">
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
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Network className="h-4 w-4 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900">IP Tracker</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Banner */}
        <div className="mb-8">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-green-700 font-medium">Connected</span>
            <span className="text-gray-600">Your IP information has been detected successfully</span>
          </div>
        </div>

        {/* IP Address Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* IPv4 Card */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Globe className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">IPv4 Address</h3>
                    <p className="text-sm text-gray-500">Internet Protocol version 4</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCopy(ipInfo?.ip || '', 'IPv4 address')}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-mono text-2xl font-bold text-gray-900">{ipInfo?.ip || 'Not available'}</div>
                <div className="text-sm text-gray-500 mt-1">Public IP Address</div>
              </div>
            </CardContent>
          </Card>

          {/* IPv6 Card */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Network className="h-5 w-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">IPv6 Address</h3>
                    <p className="text-sm text-gray-500">Internet Protocol version 6</p>
                  </div>
                </div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => handleCopy(ipInfo?.ipv6 || '', 'IPv6 address')}
                  disabled={!ipInfo?.ipv6}
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="font-mono text-lg font-bold text-gray-900 break-all">
                  {ipInfo?.ipv6 || 'Not available'}
                </div>
                <div className="text-sm text-gray-500 mt-1">Public IPv6 Address</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Location Card */}
          <Card className="lg:col-span-2 overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Geographic Location</h3>
                  <p className="text-sm text-gray-500">Based on your IP address</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">City</span>
                    <span className="text-sm font-semibold text-gray-900">{ipInfo?.city || 'Not available'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Region</span>
                    <span className="text-sm font-semibold text-gray-900">{ipInfo?.region || 'Not available'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Country</span>
                    <span className="text-sm font-semibold text-gray-900">{ipInfo?.country || 'Not available'}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Postal Code</span>
                    <span className="text-sm font-semibold text-gray-900">{ipInfo?.postalCode || 'Not available'}</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Coordinates</span>
                    <span className="text-sm font-mono text-gray-900">
                      {ipInfo?.latitude && ipInfo?.longitude 
                        ? `${ipInfo.latitude}, ${ipInfo.longitude}` 
                        : 'Not available'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-sm font-medium text-gray-500">Timezone</span>
                    <span className="text-sm font-semibold text-gray-900">{ipInfo?.timezone || 'Not available'}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ISP Information Card */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Building className="h-5 w-5 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">ISP Information</h3>
                  <p className="text-sm text-gray-500">Internet Service Provider</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Provider</div>
                  <div className="text-sm font-semibold text-gray-900">{ipInfo?.isp || 'Not available'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Organization</div>
                  <div className="text-sm font-semibold text-gray-900">{ipInfo?.organization || 'Not available'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">AS Number</div>
                  <div className="text-sm font-mono text-gray-900">{ipInfo?.asn || 'Not available'}</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500 mb-1">Connection Type</div>
                  <div className="text-sm font-semibold text-gray-900">{ipInfo?.connectionType || 'Not available'}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Security Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Security Status Card */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <Shield className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Security Status</h3>
                  <p className="text-sm text-gray-500">IP reputation and security checks</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Threat Level</span>
                  <Badge variant={ipInfo?.threatLevel === 'clean' ? 'default' : 'destructive'} className="bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    {ipInfo?.threatLevel || 'Unknown'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Proxy/VPN</span>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                    <XCircle className="h-3 w-3 mr-1" />
                    {ipInfo?.vpn ? 'Detected' : 'Not Detected'}
                  </Badge>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Tor Exit Node</span>
                  <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                    <XCircle className="h-3 w-3 mr-1" />
                    {ipInfo?.tor ? 'Detected' : 'Not Detected'}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Information Card */}
          <Card className="overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                  <Info className="h-5 w-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Additional Information</h3>
                  <p className="text-sm text-gray-500">Technical details and metadata</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">User Agent</span>
                  <span className="text-sm font-semibold text-gray-900">{ipInfo?.userAgent || 'Not available'}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Language</span>
                  <span className="text-sm font-semibold text-gray-900">{ipInfo?.language || 'Not available'}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Currency</span>
                  <span className="text-sm font-semibold text-gray-900">{ipInfo?.currency || 'Not available'}</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm font-medium text-gray-500">Calling Code</span>
                  <span className="text-sm font-semibold text-gray-900">{ipInfo?.callingCode || 'Not available'}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Actions Section */}
        <Card className="overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <RefreshCw className="h-5 w-5 text-gray-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Actions</h3>
                <p className="text-sm text-gray-500">Tools and utilities for your IP address</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Button onClick={handleRefresh} disabled={isRefreshing}>
                <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                Refresh Data
              </Button>
              <Button variant="outline" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export JSON
              </Button>
              <Button variant="outline" onClick={() => handleCopy(window.location.href, 'Current URL')}>
                <Share2 className="h-4 w-4 mr-2" />
                Share Results
              </Button>
              <Button variant="outline" disabled>
                <History className="h-4 w-4 mr-2" />
                View History
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Network className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-semibold text-gray-900">IP Tracker</span>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                A comprehensive IP address and location tracking tool that provides detailed information about your internet connection and geographic location.
              </p>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">API Documentation</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Terms of Service</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Help Center</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Contact Us</a></li>
                <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors duration-200">Status Page</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 mt-8 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-600 text-sm">
                © 2024 IP Tracker. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 mt-4 md:mt-0">
                <span className="text-sm text-gray-500">Powered by</span>
                <div className="flex items-center space-x-2">
                  <Network className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-600">GeoIP API</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
