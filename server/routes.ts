import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ipInfoSchema, type IPInfo } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // IP Information endpoint
  app.get("/api/ip-info", async (req, res) => {
    try {
      // Get client IP address
      const clientIp = req.ip || req.connection.remoteAddress || req.socket.remoteAddress || 
        (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
        req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || '127.0.0.1';

      // Clean up IP address (remove IPv6 prefix if present)
      const cleanIp = Array.isArray(clientIp) ? clientIp[0] : clientIp.replace(/^::ffff:/, '');

      // Get IP information from multiple sources
      const ipInfo = await getIPInformation(cleanIp, req.headers['user-agent'] || '');
      
      res.json(ipInfo);
    } catch (error) {
      console.error('Error fetching IP information:', error);
      res.status(500).json({ 
        error: 'Failed to fetch IP information',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

async function getIPInformation(ip: string, userAgent: string): Promise<IPInfo> {
  try {
    // For localhost/private IPs, use a public IP service
    const isLocalhost = ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.');
    
    let ipToLookup = ip;
    if (isLocalhost) {
      // Get public IP first
      try {
        const publicIpResponse = await fetch('https://api.ipify.org?format=json');
        const publicIpData = await publicIpResponse.json();
        ipToLookup = publicIpData.ip;
      } catch (error) {
        console.warn('Failed to get public IP, using provided IP:', ip);
      }
    }

    // Primary API: ipapi.co
    let ipInfo: Partial<IPInfo> = {};
    
    try {
      const response = await fetch(`https://ipapi.co/${ipToLookup}/json/`);
      if (response.ok) {
        const data = await response.json();
        
        if (data.error) {
          throw new Error(data.reason || 'API error');
        }
        
        ipInfo = {
          ip: data.ip,
          city: data.city,
          region: data.region,
          country: data.country_name,
          countryCode: data.country_code,
          postalCode: data.postal,
          latitude: data.latitude,
          longitude: data.longitude,
          timezone: data.timezone,
          isp: data.org,
          organization: data.org,
          asn: data.asn,
          currency: data.currency,
          callingCode: data.country_calling_code,
          language: data.languages,
          userAgent: userAgent,
        };
      }
    } catch (error) {
      console.warn('Primary API failed, trying fallback:', error);
    }

    // Fallback API: ip-api.com
    if (!ipInfo.ip) {
      try {
        const response = await fetch(`http://ip-api.com/json/${ipToLookup}?fields=status,message,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,query`);
        if (response.ok) {
          const data = await response.json();
          
          if (data.status === 'success') {
            ipInfo = {
              ip: data.query,
              city: data.city,
              region: data.regionName,
              country: data.country,
              countryCode: data.countryCode,
              postalCode: data.zip,
              latitude: data.lat,
              longitude: data.lon,
              timezone: data.timezone,
              isp: data.isp,
              organization: data.org,
              asn: data.as,
              userAgent: userAgent,
            };
          }
        }
      } catch (error) {
        console.warn('Fallback API failed:', error);
      }
    }

    // Get IPv6 information if available
    try {
      const ipv6Response = await fetch('https://api6.ipify.org?format=json');
      if (ipv6Response.ok) {
        const ipv6Data = await ipv6Response.json();
        ipInfo.ipv6 = ipv6Data.ip;
      }
    } catch (error) {
      console.warn('IPv6 lookup failed:', error);
    }

    // Add security information (simplified)
    ipInfo.proxy = false;
    ipInfo.vpn = false;
    ipInfo.tor = false;
    ipInfo.threatLevel = 'clean';
    ipInfo.connectionType = 'broadband';

    // Ensure we have at least the IP address
    if (!ipInfo.ip) {
      ipInfo.ip = ipToLookup;
    }

    // Parse user agent for browser info
    if (userAgent) {
      const browserMatch = userAgent.match(/Chrome\/(\d+)/);
      if (browserMatch) {
        ipInfo.userAgent = `Chrome ${browserMatch[1]}`;
      } else if (userAgent.includes('Firefox')) {
        const firefoxMatch = userAgent.match(/Firefox\/(\d+)/);
        ipInfo.userAgent = firefoxMatch ? `Firefox ${firefoxMatch[1]}` : 'Firefox';
      } else if (userAgent.includes('Safari')) {
        ipInfo.userAgent = 'Safari';
      } else {
        ipInfo.userAgent = 'Unknown Browser';
      }
    }

    return ipInfoSchema.parse(ipInfo);
  } catch (error) {
    console.error('Error in getIPInformation:', error);
    // Return minimal info if everything fails
    return {
      ip: ip,
      city: 'Unknown',
      region: 'Unknown',
      country: 'Unknown',
      threatLevel: 'unknown',
      proxy: false,
      vpn: false,
      tor: false,
      userAgent: userAgent || 'Unknown',
    };
  }
}
