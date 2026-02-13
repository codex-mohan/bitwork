"use client";

import { Card } from "@bitwork/ui/components/card";
import { Progress } from "@bitwork/ui/components/progress";
import {
  ArrowDown,
  ArrowUp,
  BarChart3,
  Briefcase,
  Eye,
  TrendingUp,
  Users,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AnimatedCard,
  FadeInUp,
  PageTransition,
  StaggerContainer,
} from "./animations";

interface AnalyticsViewProps {
  initialStats: {
    activeJobs: number;
    totalApplications: number;
    pendingApplications: number;
    totalViews: number;
  } | null;
  userId: string;
  role?: string | null;
}

// Mock data for charts - in a real app, this would come from the database
const monthlyData = [
  { month: "Jan", views: 120, applications: 15 },
  { month: "Feb", views: 180, applications: 22 },
  { month: "Mar", views: 240, applications: 28 },
  { month: "Apr", views: 200, applications: 20 },
  { month: "May", views: 280, applications: 35 },
  { month: "Jun", views: 320, applications: 42 },
];

const categoryData = [
  { name: "Plumbing", value: 35, color: "#2d4a3e" },
  { name: "Electrical", value: 25, color: "#c5d4c0" },
  { name: "Carpentry", value: 20, color: "#e8ebe6" },
  { name: "Cleaning", value: 12, color: "#6b7280" },
  { name: "Other", value: 8, color: "#d1d5db" },
];

const performanceMetrics = [
  { label: "Profile Completion", value: 85 },
  { label: "Response Rate", value: 92 },
  { label: "Job Success Rate", value: 78 },
  { label: "Client Satisfaction", value: 95 },
];

export function AnalyticsView({ initialStats, role }: AnalyticsViewProps) {
  const isProvider = role === "provider";

  if (!isProvider) {
    return (
      <PageTransition className="space-y-6">
        <FadeInUp>
          <div className="flex flex-col items-center justify-center rounded-lg border bg-muted/30 py-16 text-center">
            <BarChart3 className="mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 font-semibold text-xl">
              Analytics for Providers
            </h3>
            <p className="max-w-sm text-muted-foreground">
              Analytics features are available for job providers. Switch to a
              provider account to access detailed insights.
            </p>
          </div>
        </FadeInUp>
      </PageTransition>
    );
  }

  const stats = initialStats ?? {
    activeJobs: 0,
    totalApplications: 0,
    pendingApplications: 0,
    totalViews: 0,
  };

  const statCards = [
    {
      title: "Total Views",
      value: stats.totalViews.toLocaleString(),
      change: "+12%",
      trend: "up",
      icon: <Eye className="h-5 w-5" />,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Active Jobs",
      value: stats.activeJobs.toString(),
      change: "+3",
      trend: "up",
      icon: <Briefcase className="h-5 w-5" />,
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Total Applications",
      value: stats.totalApplications.toString(),
      change: "+8%",
      trend: "up",
      icon: <Users className="h-5 w-5" />,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Pending Review",
      value: stats.pendingApplications.toString(),
      change: "-2",
      trend: "down",
      icon: <TrendingUp className="h-5 w-5" />,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  return (
    <PageTransition className="space-y-6">
      <FadeInUp>
        <div>
          <h1 className="font-bold text-3xl tracking-tight">Analytics</h1>
          <p className="mt-1 text-muted-foreground">
            Track your performance and insights
          </p>
        </div>
      </FadeInUp>

      <StaggerContainer className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat, index) => (
            <AnimatedCard index={index} key={stat.title}>
              <Card className="p-6 transition-all duration-300 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                    <div className={stat.color}>{stat.icon}</div>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      stat.trend === "up" ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {stat.trend === "up" ? (
                      <ArrowUp className="h-3 w-3" />
                    ) : (
                      <ArrowDown className="h-3 w-3" />
                    )}
                    {stat.change}
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-muted-foreground text-sm">{stat.title}</p>
                  <p className="font-bold text-2xl">{stat.value}</p>
                </div>
              </Card>
            </AnimatedCard>
          ))}
        </div>

        {/* Charts Row */}
        <div className="grid gap-6 lg:grid-cols-2">
          <AnimatedCard index={0}>
            <Card className="p-6">
              <h3 className="mb-4 font-semibold text-lg">
                Views & Applications
              </h3>
              <div className="h-64">
                <ResponsiveContainer height="100%" width="100%">
                  <LineChart data={monthlyData}>
                    <CartesianGrid stroke="#e8ebe6" strokeDasharray="3 3" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                      }}
                    />
                    <Line
                      dataKey="views"
                      dot={{ fill: "#2d4a3e" }}
                      name="Views"
                      stroke="#2d4a3e"
                      strokeWidth={2}
                    />
                    <Line
                      dataKey="applications"
                      dot={{ fill: "#c5d4c0" }}
                      name="Applications"
                      stroke="#c5d4c0"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </AnimatedCard>

          <AnimatedCard index={1}>
            <Card className="p-6">
              <h3 className="mb-4 font-semibold text-lg">Jobs by Category</h3>
              <div className="h-64">
                <ResponsiveContainer height="100%" width="100%">
                  <PieChart>
                    <Pie
                      cx="50%"
                      cy="50%"
                      data={categoryData}
                      dataKey="value"
                      innerRadius={60}
                      nameKey="name"
                      outerRadius={80}
                      paddingAngle={2}
                    >
                      {categoryData.map((entry) => (
                        <Cell fill={entry.color} key={entry.name} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#ffffff",
                        border: "1px solid #d1d5db",
                        borderRadius: "8px",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex flex-wrap justify-center gap-4">
                {categoryData.map((item) => (
                  <div className="flex items-center gap-2" key={item.name}>
                    <div
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-muted-foreground text-sm">
                      {item.name} ({item.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </AnimatedCard>
        </div>

        {/* Performance Metrics */}
        <AnimatedCard index={0}>
          <Card className="p-6">
            <h3 className="mb-6 font-semibold text-lg">Performance Metrics</h3>
            <div className="grid gap-6 md:grid-cols-2">
              {performanceMetrics.map((metric) => (
                <div key={metric.label}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-muted-foreground text-sm">
                      {metric.label}
                    </span>
                    <span className="font-medium text-sm">{metric.value}%</span>
                  </div>
                  <Progress className="h-2" value={metric.value} />
                </div>
              ))}
            </div>
          </Card>
        </AnimatedCard>

        {/* Monthly Activity Chart */}
        <AnimatedCard index={0}>
          <Card className="p-6">
            <h3 className="mb-4 font-semibold text-lg">Monthly Activity</h3>
            <div className="h-64">
              <ResponsiveContainer height="100%" width="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid stroke="#e8ebe6" strokeDasharray="3 3" />
                  <XAxis dataKey="month" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#ffffff",
                      border: "1px solid #d1d5db",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar
                    dataKey="applications"
                    fill="#2d4a3e"
                    name="Applications"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </AnimatedCard>
      </StaggerContainer>
    </PageTransition>
  );
}
