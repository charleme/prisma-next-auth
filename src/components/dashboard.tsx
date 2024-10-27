"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ChartContainer } from "~/components/ui/chart";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { FileText, MessageSquare, Users } from "lucide-react";
import { type AppRouterOutput } from "~/server/api/root";
import { useMemo } from "react";

type DashBoardProps = {
  userCount: AppRouterOutput["user"]["userCount"];
  postEvolution: AppRouterOutput["post"]["getPostEvolution"];
  commentEvolution: AppRouterOutput["comment"]["getCommentEvolution"];
  postCountPerDay: AppRouterOutput["post"]["getPostCountPerDay"];
  commentCountPerDay: AppRouterOutput["comment"]["getCommentCountPerDay"];
};

export default function Dashboard({
  userCount,
  postEvolution,
  commentEvolution,
  postCountPerDay,
  commentCountPerDay,
}: DashBoardProps) {
  const activityData = useMemo(() => {
    const postCountIndexByDate = postCountPerDay.reduce<Record<string, number>>(
      (acc, item) => ({
        ...acc,
        [item.date.toLocaleDateString()]: item.posts,
      }),
      {},
    );

    const commentCountIndexByDate = commentCountPerDay.reduce<
      Record<string, number>
    >(
      (acc, item) => ({
        ...acc,
        [item.date.toLocaleDateString()]: item.comments,
      }),
      {},
    );
    const dates: string[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date();
      date.setDate(date.getDate() - 6 + i);
      dates.push(date.toLocaleDateString());
    }

    return dates.map((date) => {
      return {
        date,
        posts: postCountIndexByDate[date] ?? 0,
        comments: commentCountIndexByDate[date] ?? 0,
      };
    });
  }, [postCountPerDay, commentCountPerDay]);

  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">User Activity Dashboard</h1>

      <div className="grid gap-8 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {userCount.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Daily Posts
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {postEvolution.currentWeekCount}
            </div>
            <p className="text-xs text-muted-foreground">
              {postEvolution.rateBetweenWeeks
                ? `${postEvolution.rateBetweenWeeks >= 1 ? "+" : ""}${((postEvolution.rateBetweenWeeks - 1) * 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}% from last week`
                : ""}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Daily Comments
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {commentEvolution.currentWeekCount.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              {commentEvolution.rateBetweenWeeks
                ? `${commentEvolution.rateBetweenWeeks >= 1 ? "+" : ""}${((commentEvolution.rateBetweenWeeks - 1) * 100).toLocaleString(undefined, { maximumFractionDigits: 0 })}% from last week`
                : ""}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Post and Comment Activity</CardTitle>
          <CardDescription>
            Daily post and comment counts over the last 7 days
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              posts: {
                label: "Posts",
                color: "hsl(var(--chart-1))",
              },
              comments: {
                label: "Comments",
                color: "hsl(var(--chart-2))",
              },
            }}
            className="h-[400px] w-full"
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={activityData}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis yAxisId="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip
                  content={({ active, payload, label }) => {
                    if (active && payload?.length) {
                      return (
                        <div className="rounded-lg border bg-background p-2 shadow-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="flex flex-col">
                              <span className="text-[0.70rem] uppercase text-muted-foreground">
                                Date
                              </span>
                              <span className="font-bold text-muted-foreground">
                                {label}
                              </span>
                            </div>
                            {payload.map((item) => (
                              <div key={item.name} className="flex flex-col">
                                <span className="text-[0.70rem] uppercase text-muted-foreground">
                                  {item.name}
                                </span>
                                <span
                                  className="font-bold"
                                  style={{ color: item.color }}
                                >
                                  {item.value}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="posts"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                  stroke={"hsl(var(--chart-1))"}
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="comments"
                  activeDot={{ r: 8 }}
                  strokeWidth={2}
                  stroke={"hsl(var(--chart-4))"}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
}
