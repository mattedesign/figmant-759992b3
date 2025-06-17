
interface DribbbleShot {
  id: number;
  title: string;
  images: {
    hidpi: string;
    normal: string;
    teaser: string;
  };
  html_url: string;
  user: {
    name: string;
    avatar_url: string;
  };
  tags: string[];
}

interface DribbbleResponse {
  shots: DribbbleShot[];
}

class DribbbleService {
  private static readonly BASE_URL = 'https://api.dribbble.com/v2';
  
  static async getPopularProductDesignShots(limit: number = 12): Promise<DribbbleShot[]> {
    try {
      // Using Dribbble's public API endpoint for popular shots
      // Note: This uses a public endpoint that doesn't require authentication
      const response = await fetch(`https://api.dribbble.com/v2/shots?per_page=${limit}&sort=popularity&timeframe=year&tags=ui,ux`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Dribbble API error: ${response.status}`);
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.warn('Failed to fetch Dribbble shots:', error);
      // Return fallback mock data if API fails
      return this.getFallbackShots();
    }
  }

  private static getFallbackShots(): DribbbleShot[] {
    return [
      {
        id: 1,
        title: "Mobile Banking App UI",
        images: {
          hidpi: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=800&h=600&fit=crop",
          normal: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
          teaser: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=200&h=150&fit=crop"
        },
        html_url: "#",
        user: {
          name: "Design Studio",
          avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
        },
        tags: ["ui", "mobile", "fintech"]
      },
      {
        id: 2,
        title: "E-commerce Dashboard",
        images: {
          hidpi: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
          normal: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
          teaser: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200&h=150&fit=crop"
        },
        html_url: "#",
        user: {
          name: "UX Designer",
          avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b25c0692?w=40&h=40&fit=crop&crop=face"
        },
        tags: ["dashboard", "ecommerce", "analytics"]
      },
      {
        id: 3,
        title: "Social Media App",
        images: {
          hidpi: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
          normal: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop",
          teaser: "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=200&h=150&fit=crop"
        },
        html_url: "#",
        user: {
          name: "Creative Agency",
          avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
        },
        tags: ["social", "mobile", "interaction"]
      },
      {
        id: 4,
        title: "Healthcare App Interface",
        images: {
          hidpi: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=600&fit=crop",
          normal: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop",
          teaser: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=200&h=150&fit=crop"
        },
        html_url: "#",
        user: {
          name: "Health Design Co",
          avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&crop=face"
        },
        tags: ["healthcare", "mobile", "wellness"]
      },
      {
        id: 5,
        title: "Travel Booking Platform",
        images: {
          hidpi: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&h=600&fit=crop",
          normal: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=400&h=300&fit=crop",
          teaser: "https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=200&h=150&fit=crop"
        },
        html_url: "#",
        user: {
          name: "Travel UI",
          avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face"
        },
        tags: ["travel", "booking", "web"]
      },
      {
        id: 6,
        title: "Cryptocurrency Wallet",
        images: {
          hidpi: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=800&h=600&fit=crop",
          normal: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop",
          teaser: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=200&h=150&fit=crop"
        },
        html_url: "#",
        user: {
          name: "Crypto Design",
          avatar_url: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
        },
        tags: ["crypto", "wallet", "fintech"]
      },
      {
        id: 7,
        title: "Food Delivery App",
        images: {
          hidpi: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop",
          normal: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=300&fit=crop",
          teaser: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=200&h=150&fit=crop"
        },
        html_url: "#",
        user: {
          name: "Food Tech",
          avatar_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face"
        },
        tags: ["food", "delivery", "mobile"]
      },
      {
        id: 8,
        title: "Learning Management System",
        images: {
          hidpi: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=800&h=600&fit=crop",
          normal: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=400&h=300&fit=crop",
          teaser: "https://images.unsplash.com/photo-1501504905252-473c47e087f8?w=200&h=150&fit=crop"
        },
        html_url: "#",
        user: {
          name: "EduTech",
          avatar_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face"
        },
        tags: ["education", "learning", "web"]
      },
      {
        id: 9,
        title: "Music Streaming Interface",
        images: {
          hidpi: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop",
          normal: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
          teaser: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=200&h=150&fit=crop"
        },
        html_url: "#",
        user: {
          name: "Music UI",
          avatar_url: "https://images.unsplash.com/photo-1494790108755-2616b25c0692?w=40&h=40&fit=crop&crop=face"
        },
        tags: ["music", "streaming", "audio"]
      },
      {
        id: 10,
        title: "Project Management Tool",
        images: {
          hidpi: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=600&fit=crop",
          normal: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop",
          teaser: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=150&fit=crop"
        },
        html_url: "#",
        user: {
          name: "Productivity Co",
          avatar_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face"
        },
        tags: ["productivity", "management", "collaboration"]
      },
      {
        id: 11,
        title: "Real Estate Platform",
        images: {
          hidpi: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&h=600&fit=crop",
          normal: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=300&fit=crop",
          teaser: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=200&h=150&fit=crop"
        },
        html_url: "#",
        user: {
          name: "Prop Design",
          avatar_url: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=40&h=40&fit=crop&crop=face"
        },
        tags: ["real-estate", "property", "listings"]
      },
      {
        id: 12,
        title: "Fitness Tracking App",
        images: {
          hidpi: "https://images.unsplash.com/photo-1571019613914-85e3cdfe37e2?w=800&h=600&fit=crop",
          normal: "https://images.unsplash.com/photo-1571019613914-85e3cdfe37e2?w=400&h=300&fit=crop",
          teaser: "https://images.unsplash.com/photo-1571019613914-85e3cdfe37e2?w=200&h=150&fit=crop"
        },
        html_url: "#",
        user: {
          name: "Fitness Tech",
          avatar_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face"
        },
        tags: ["fitness", "health", "tracking"]
      }
    ];
  }
}

export { DribbbleService };
export type { DribbbleShot };
