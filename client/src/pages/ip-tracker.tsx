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
  Search
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center relative">
                  <Globe className="h-4 w-4 text-white" />
                  <Search className="h-2 w-2 text-white absolute -top-1 -right-1" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Your IP</h1>
              </div>
            </div>
          </div>
        </header>
        <main className="flex">
          {/* Left Ad Space */}
          <div className="hidden xl:block w-32 p-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p>Ad Space</p>
                <p className="text-xs">160x600</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-300">Detecting your IP address and location...</p>
              </div>
            </div>
          </div>

          {/* Right Ad Space */}
          <div className="hidden xl:block w-32 p-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p>Ad Space</p>
                <p className="text-xs">160x600</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center relative">
                  <Globe className="h-4 w-4 text-white" />
                  <Search className="h-2 w-2 text-white absolute -top-1 -right-1" />
                </div>
                <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Your IP</h1>
              </div>
            </div>
          </div>
        </header>
        <main className="flex">
          {/* Left Ad Space */}
          <div className="hidden xl:block w-32 p-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p>Ad Space</p>
                <p className="text-xs">160x600</p>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

          {/* Right Ad Space */}
          <div className="hidden xl:block w-32 p-4">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-96 flex items-center justify-center">
              <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                <p>Ad Space</p>
                <p className="text-xs">160x600</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center relative">
                <Globe className="h-4 w-4 text-white" />
                <Search className="h-2 w-2 text-white absolute -top-1 -right-1" />
              </div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">Your IP</h1>
            </div>
          </div>
        </div>
      </header>

      <main className="flex">
        {/* Left Ad Space */}
        <div className="hidden xl:block w-32 p-4">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-96 flex items-center justify-center sticky top-4">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Ad Space</p>
              <p className="text-xs">160x600</p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                      <Globe className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">IPv4 Address</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Internet Protocol version 4</p>
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
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="font-mono text-2xl font-bold text-gray-900 dark:text-white">{ipInfo?.ip || 'Not available'}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Public IP Address</div>
                </div>
              </CardContent>
            </Card>

            {/* IPv6 Card */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/50 rounded-lg flex items-center justify-center">
                      <Network className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">IPv6 Address</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">Internet Protocol version 6</p>
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
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="font-mono text-lg font-bold text-gray-900 dark:text-white break-all">
                    {ipInfo?.ipv6 || 'Not available'}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">Public IPv6 Address</div>
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
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/50 rounded-lg flex items-center justify-center">
                    <MapPin className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Geographic Location</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Based on your IP address</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </div>
                  <div className="space-y-4">
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
                </div>
              </CardContent>
            </Card>

            {/* ISP Information Card */}
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/50 rounded-lg flex items-center justify-center">
                    <Building className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">ISP Information</h3>
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
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center">
                    <Shield className="h-5 w-5 text-red-600 dark:text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Security Status</h3>
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
            <Card className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-900/50 rounded-lg flex items-center justify-center">
                    <Info className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Additional Information</h3>
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
            <Button onClick={handleRefresh} disabled={isRefreshing}>
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Refresh Data
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </Button>
          </div>
        </div>

        {/* Right Ad Space */}
        <div className="hidden xl:block w-32 p-4">
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg h-96 flex items-center justify-center sticky top-4">
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
              <p>Ad Space</p>
              <p className="text-xs">160x600</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}