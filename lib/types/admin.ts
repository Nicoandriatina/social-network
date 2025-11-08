// types/admin.ts

// ============================================
// STATS OVERVIEW (KPIs Généraux)
// ============================================
export interface AdminOverviewStats {
  totalUsers: number;
  usersGrowth: number;
  growthRate: number;
  totalDonations: number;
  totalAmount: number;
  activeProjects: number;
  pendingValidations: number;
  period: string;
  generatedAt: string;
}

// ============================================
// STATS USERS
// ============================================
export interface UserStats {
  summary: {
    totalUsers: number;
    activeUsers: number;
    validatedUsers: number;
    activationRate: number;
    retentionRate: number;
    newUsersThisWeek: number;
  };
  usersByType: Array<{
    type: string;
    count: number;
  }>;
  dailySignups: Array<{
    date: string;
    etablissements: number;
    enseignants: number;
    donateurs: number;
  }>;
  pendingValidation: Array<{
    type: string;
    count: number;
  }>;
  usersByRegion: Array<{
    region: string;
    count: number;
  }>;
  mostActiveUsers: Array<{
    id: string;
    fullName: string;
    type: string;
    avatar: string | null;
    activityScore: number;
    details: {
      publications: number;
      comments: number;
      likes: number;
    };
  }>;
  usersByTenure: {
    lessThanMonth: number;
    oneToThreeMonths: number;
    threeToSixMonths: number;
    moreThanSixMonths: number;
  };
  period: string;
  generatedAt: string;
}

// ============================================
// STATS DONATIONS
// ============================================
export interface DonationStats {
  summary: {
    totalDonations: number;
    receivedDonations: number;
    sentDonations: number;
    pendingDonations: number;
    totalAmount: number;
    averageDonationAmount: number;
    averageProcessingTime: number;
    satisfactionRate: number;
  };
  donationsByType: Array<{
    type: string;
    count: number;
    totalAmount: number;
    totalQuantity: number;
  }>;
  funnel: {
    created: number;
    sent: number;
    received: number;
    conversionRate: number;
  };
  dailyDonations: Array<{
    date: string;
    count: number;
    amount: number;
  }>;
  stuckDonations: Array<{
    id: string;
    libelle: string;
    statut: string;
    daysStuck: number;
    donor: string;
    recipient: string;
    projectTitle: string;
  }>;
  topRecipientSchools: Array<{
    id: string;
    name: string;
    region: string;
    donationsReceived: number;
  }>;
  donationsByRegion: Array<{
    region: string;
    count: number;
    amount: number;
  }>;
  period: string;
  generatedAt: string;
}

// ============================================
// STATS PROJECTS
// ============================================
export interface ProjectStats {
  summary: {
    totalProjects: number;
    publishedProjects: number;
    draftProjects: number;
    archivedProjects: number;
    pendingValidation: number;
    projectsWithDonations: number;
    successRate: number;
    avgTimeToFirstDonation: number;
    avgProjectDuration: number;
    ongoingProjects: number;
    completedProjects: number;
  };
  projectsByCategory: Array<{
    category: string;
    count: number;
  }>;
  topProjects: Array<{
    id: string;
    reference: string;
    title: string;
    category: string;
    schoolName: string;
    region: string;
    donationsCount: number;
    totalAmount: number;
    createdAt: Date;
  }>;
  dailyProjects: Array<{
    date: string;
    count: number;
  }>;
  inactiveProjects: Array<{
    id: string;
    reference: string;
    title: string;
    schoolName: string;
    daysInactive: number;
  }>;
  projectsByRegion: Array<{
    region: string;
    totalProjects: number;
    fundedProjects: number;
    fundingRate: string;
  }>;
  period: string;
  generatedAt: string;
}

// ============================================
// STATS ENGAGEMENT
// ============================================
export interface EngagementStats {
  summary: {
    totalLikes: number;
    totalComments: number;
    totalShares: number;
    totalPublications: number;
    totalInteractions: number;
    engagementRate: number;
    responseRate: number;
    viralityRate: number;
    growth: {
      likes: number;
      comments: number;
      shares: number;
    };
  };
  dailyEngagement: Array<{
    date: string;
    likes: number;
    comments: number;
    shares: number;
  }>;
  topPublications: Array<{
    id: string;
    content: string;
    author: {
      id: string;
      fullName: string;
      type: string;
      avatar: string | null;
    };
    createdAt: Date;
    engagement: {
      likes: number;
      comments: number;
      shares: number;
      total: number;
    };
  }>;
  mostActiveUsers: Array<{
    id: string;
    fullName: string;
    type: string;
    avatar: string | null;
    totalInteractions: number;
    breakdown: {
      likes: number;
      comments: number;
      shares: number;
      publications: number;
    };
  }>;
  activityByHour: Array<{
    hour: number;
    count: number;
  }>;
  activityByDayOfWeek: Array<{
    day: number;
    dayName: string;
    count: number;
  }>;
  publicationsByType: Array<{
    type: string;
    count: number;
  }>;
  period: string;
  generatedAt: string;
}

// ============================================
// TOP DONORS
// ============================================
export interface TopDonor {
  id: string;
  fullName: string;
  email: string;
  avatar: string | null;
  memberSince: Date;
  stats: {
    totalDonations: number;
    totalAmount: number;
    donationsByType: {
      MONETAIRE: number;
      VIVRES: number;
      NON_VIVRES: number;
    };
    uniqueSchools: number;
    donationFrequency: number;
    lastDonationDate: Date | null;
    lastDonationProject: string | null;
  };
}

export interface TopDonorsResponse {
  topDonors: TopDonor[];
  period: string;
  limit: number;
  globalStats: {
    totalDonations: number;
    totalAmount: number;
    averagePerDonor: number;
  };
  generatedAt: string;
}

// ============================================
// API RESPONSE TYPES
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: string;
}

// ============================================
// COMMON TYPES
// ============================================
export type TimePeriod = "7d" | "30d" | "90d" | "1y" | "all";

export type UserType = "ETABLISSEMENT" | "ENSEIGNANT" | "DONATEUR" | "SUPERADMIN";

export type DonationType = "MONETAIRE" | "VIVRES" | "NON_VIVRES";

export type DonationStatus = "EN_ATTENTE" | "ENVOYE" | "RECEPTIONNE" | "ANNULE";

export type ProjectStatus = "BROUILLON" | "EN_ATTENTE_VALIDATION" | "PUBLIE" | "ARCHIVE";

export type ProjectCategory = 
  | "CONSTRUCTION" 
  | "REHABILITATION" 
  | "EQUIPEMENT" 
  | "FORMATION"
  | "AUTRE";

// ============================================
// DASHBOARD FILTER OPTIONS
// ============================================
export interface DashboardFilters {
  period: TimePeriod;
  userType?: UserType;
  region?: string;
  category?: ProjectCategory;
  status?: DonationStatus | ProjectStatus;
}

// ============================================
// CHART DATA TYPES
// ============================================
export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface PieChartData {
  name: string;
  value: number;
  color?: string;
}

export interface BarChartData {
  category: string;
  value: number;
  color?: string;
}

// ============================================
// TABLE DATA TYPES
// ============================================
export interface PendingUser {
  id: string;
  fullName: string;
  email: string;
  type: UserType;
  phone: string | null;
  createdAt: Date;
  daysWaiting: number;
}

export interface RecentActivity {
  id: string;
  type: "user" | "donation" | "project" | "validation" | "alert";
  message: string;
  timestamp: Date;
  relatedUserId?: string;
  relatedItemId?: string;
}

// ============================================
// ALERT TYPES
// ============================================
export interface Alert {
  id: string;
  type: "warning" | "error" | "info" | "success";
  priority: "low" | "medium" | "high" | "critical";
  title: string;
  message: string;
  count?: number;
  actionLabel?: string;
  actionUrl?: string;
  createdAt: Date;
}

// ============================================
// EXPORT TYPES
// ============================================
export interface ExportOptions {
  format: "csv" | "xlsx" | "pdf";
  dataType: "users" | "donations" | "projects" | "engagement";
  period: TimePeriod;
  filters?: DashboardFilters;
}

// ============================================
// PAGINATION
// ============================================
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  };
}

// ============================================
// MODERATION TYPES
// ============================================
export interface ContentReport {
  id: string;
  contentType: "publication" | "comment" | "project" | "user";
  contentId: string;
  reportedBy: string;
  reason: string;
  description: string;
  status: "pending" | "reviewed" | "resolved" | "dismissed";
  createdAt: Date;
}

export interface ModerationAction {
  id: string;
  adminId: string;
  actionType: "validate" | "reject" | "suspend" | "delete" | "warn";
  targetType: "user" | "publication" | "project" | "donation";
  targetId: string;
  reason: string;
  createdAt: Date;
}

// ============================================
// NOTIFICATION TYPES
// ============================================
export interface AdminNotification {
  id: string;
  type: "validation_needed" | "stuck_donation" | "inactive_project" | "report";
  title: string;
  message: string;
  priority: "low" | "medium" | "high";
  isRead: boolean;
  actionUrl?: string;
  createdAt: Date;
}