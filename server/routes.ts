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
      
      // Save the lookup to the database
      try {
        await storage.saveIpLookup({
          ip: ipInfo.ip,
          ipv6: ipInfo.ipv6,
          city: ipInfo.city,
          region: ipInfo.region,
          country: ipInfo.country,
          countryCode: ipInfo.countryCode,
          postalCode: ipInfo.postalCode,
          latitude: ipInfo.latitude,
          longitude: ipInfo.longitude,
          timezone: ipInfo.timezone,
          isp: ipInfo.isp,
          organization: ipInfo.organization,
          asn: ipInfo.asn,
          connectionType: ipInfo.connectionType,
          proxy: ipInfo.proxy,
          vpn: ipInfo.vpn,
          tor: ipInfo.tor,
          threatLevel: ipInfo.threatLevel,
          currency: ipInfo.currency,
          callingCode: ipInfo.callingCode,
          language: ipInfo.language,
          userAgent: ipInfo.userAgent,
        });
      } catch (dbError) {
        console.warn('Failed to save IP lookup to database:', dbError);
        // Continue with response even if database save fails
      }
      
      res.json(ipInfo);
    } catch (error) {
      console.error('Error fetching IP information:', error);
      res.status(500).json({ 
        error: 'Failed to fetch IP information',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  // Get recent IP lookups
  app.get("/api/recent-lookups", async (req, res) => {
    try {
      const limit = parseInt(req.query.limit as string) || 10;
      const recentLookups = await storage.getRecentIpLookups(limit);
      res.json(recentLookups);
    } catch (error) {
      console.warn('Error fetching recent lookups:', error);
      // Return empty array instead of error to prevent UI breaking
      res.json([]);
    }
  });

  // SEO routes
  app.get("/robots.txt", (req, res) => {
    res.type('text/plain');
    res.send(`User-agent: *
Allow: /

# Sitemap
Sitemap: ${req.protocol}://${req.get('host')}/sitemap.xml

# Popular crawlers
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

# Block spam crawlers
User-agent: SemrushBot
Disallow: /

User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

# Crawl delay for respectful crawling
Crawl-delay: 1`);
  });

  app.get("/sitemap.xml", (req, res) => {
    res.type('application/xml');
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/#analytics</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/#history</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>${baseUrl}/#help</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
</urlset>`);
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
