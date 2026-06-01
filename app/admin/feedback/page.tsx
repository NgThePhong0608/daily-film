import { format } from "date-fns";
import { vi } from "date-fns/locale";
import Link from "next/link";

import {
  getFeedbackEntries,
  logoutAdmin,
  markFeedbackEntriesReviewed,
  updateFeedbackStatus,
} from "@/app/actions/feedback";
import AdminFeedbackGate from "@/components/admin/AdminFeedbackGate";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Pagination from "@/components/shared/Pagination";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin";
import { cn } from "@/lib/utils";

type AdminSort = "newest" | "oldest";
type AdminStatus = "all" | "new" | "reviewed";
type AdminDateRange = "all" | "today" | "7d" | "30d";

interface AdminFeedbackPageProps {
  searchParams: Promise<{
    page?: string;
    sort?: string;
    status?: string;
    date?: string;
  }>;
}

function parsePositiveInt(value?: string) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
}

function parseSort(value?: string): AdminSort {
  return value === "oldest" ? "oldest" : "newest";
}

function parseStatus(value?: string): AdminStatus {
  if (value === "new" || value === "reviewed") {
    return value;
  }

  return "all";
}

function parseDateRange(value?: string): AdminDateRange {
  if (value === "today" || value === "7d" || value === "30d") {
    return value;
  }

  return "all";
}

function buildAdminFeedbackUrl(params: {
  page?: number;
  sort: AdminSort;
  status: AdminStatus;
  date: AdminDateRange;
}) {
  const searchParams = new URLSearchParams();

  if (params.page && params.page > 1) {
    searchParams.set("page", String(params.page));
  }

  if (params.sort !== "newest") {
    searchParams.set("sort", params.sort);
  }

  if (params.status !== "all") {
    searchParams.set("status", params.status);
  }

  if (params.date !== "all") {
    searchParams.set("date", params.date);
  }

  const query = searchParams.toString();
  return query ? `/admin/feedback?${query}` : "/admin/feedback";
}

export default async function AdminFeedbackPage({
  searchParams,
}: AdminFeedbackPageProps) {
  const params = await searchParams;
  const currentPage = parsePositiveInt(params.page);
  const currentSort = parseSort(params.sort);
  const currentStatus = parseStatus(params.status);
  const currentDateRange = parseDateRange(params.date);
  const adminConfigured = isAdminConfigured();

  if (!adminConfigured) {
    return (
      <div className="container py-12">
        <Card className="mx-auto max-w-2xl">
          <CardHeader>
            <CardTitle>Thiếu cấu hình admin</CardTitle>
            <CardDescription>
              Thêm biến môi trường <code>ADMIN_FEEDBACK_PASSWORD</code> để mở trang đọc feedback.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  const isAuthenticated = await isAdminAuthenticated();

  if (!isAuthenticated) {
    return (
      <div className="container py-10">
        <AdminFeedbackGate />
      </div>
    );
  }

  const feedbackResult = await getFeedbackEntries({
    page: currentPage,
    sort: currentSort,
    status: currentStatus,
    dateRange: currentDateRange,
  });
  const entries = feedbackResult.entries;
  const reviewedCount = entries.filter((entry) => entry.status === "reviewed").length;
  const newCount = entries.filter((entry) => entry.status === "new").length;
  const basePaginationUrl = buildAdminFeedbackUrl({
    sort: currentSort,
    status: currentStatus,
    date: currentDateRange,
  });
  const markCurrentPageReviewedAction = async (formData: FormData) => {
    "use server";
    await markFeedbackEntriesReviewed(formData);
  };
  const updateEntryStatusAction = async (formData: FormData) => {
    "use server";
    await updateFeedbackStatus(formData);
  };

  return (
    <div className="container py-10">
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
            Admin
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Feedback Inbox</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {feedbackResult.totalItems} phản hồi theo bộ lọc hiện tại.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/">Quay lại trang phim</Link>
          </Button>
          <form action={logoutAdmin}>
            <Button type="submit" variant="outline">
              Đăng xuất
            </Button>
          </form>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Kết quả hiện tại</CardDescription>
            <CardTitle className="text-3xl">{feedbackResult.totalItems}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Mới</CardDescription>
            <CardTitle className="text-3xl">{newCount}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Đã xem</CardDescription>
            <CardTitle className="text-3xl">{reviewedCount}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="mt-8 flex flex-col gap-4">
        <Card>
          <CardContent className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Sắp xếp</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Mới -> Cũ", value: "newest" as const },
                  { label: "Cũ -> Mới", value: "oldest" as const },
                ].map((option) => (
                  <Button
                    key={option.value}
                    asChild
                    variant={currentSort === option.value ? "default" : "outline"}
                    size="sm"
                  >
                    <Link
                      href={buildAdminFeedbackUrl({
                        sort: option.value,
                        status: currentStatus,
                        date: currentDateRange,
                      })}
                    >
                      {option.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Theo trạng thái</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Tất cả", value: "all" as const },
                  { label: "Mới", value: "new" as const },
                  { label: "Đã xem", value: "reviewed" as const },
                ].map((option) => (
                  <Button
                    key={option.value}
                    asChild
                    variant={currentStatus === option.value ? "default" : "outline"}
                    size="sm"
                  >
                    <Link
                      href={buildAdminFeedbackUrl({
                        sort: currentSort,
                        status: option.value,
                        date: currentDateRange,
                      })}
                    >
                      {option.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium">Theo ngày</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Tất cả", value: "all" as const },
                  { label: "Hôm nay", value: "today" as const },
                  { label: "7 ngày", value: "7d" as const },
                  { label: "30 ngày", value: "30d" as const },
                ].map((option) => (
                  <Button
                    key={option.value}
                    asChild
                    variant={currentDateRange === option.value ? "default" : "outline"}
                    size="sm"
                  >
                    <Link
                      href={buildAdminFeedbackUrl({
                        sort: currentSort,
                        status: currentStatus,
                        date: option.value,
                      })}
                    >
                      {option.label}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>Bộ lọc hiện tại:</span>
              <Badge variant="outline">{currentSort === "newest" ? "Mới -> Cũ" : "Cũ -> Mới"}</Badge>
              <Badge variant="outline">
                {currentStatus === "all"
                  ? "Tất cả trạng thái"
                  : currentStatus === "new"
                    ? "Chỉ phản hồi mới"
                    : "Chỉ phản hồi đã xem"}
              </Badge>
              <Badge variant="outline">
                {currentDateRange === "all"
                  ? "Mọi thời gian"
                  : currentDateRange === "today"
                    ? "Hôm nay"
                    : currentDateRange === "7d"
                      ? "7 ngày gần đây"
                  : "30 ngày gần đây"}
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2 border-t pt-3">
              <form action={markCurrentPageReviewedAction}>
                {entries
                  .filter((entry) => entry.status === "new")
                  .map((entry) => (
                    <input key={entry.id} type="hidden" name="ids" value={entry.id} />
                  ))}
                <Button type="submit" variant="outline" size="sm" disabled={newCount === 0}>
                  Đánh dấu trang này đã xem
                </Button>
              </form>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 grid gap-4">
        {entries.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-sm text-muted-foreground">
              Không có phản hồi nào khớp với bộ lọc hiện tại.
            </CardContent>
          </Card>
        ) : (
          entries.map((entry) => (
            <Card key={entry.id} className="overflow-hidden">
              <CardHeader className="gap-2 border-b px-4 py-3">
                <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-sm">
                      <span className="rounded-full border px-3 py-1 font-medium capitalize">
                        {entry.type}
                      </span>
                      <span
                        className={cn(`rounded-full px-3 py-1 font-medium ${
                          entry.status === "new"
                            ? "bg-amber-500/15 text-amber-300"
                            : "bg-emerald-500/15 text-emerald-300"
                        }`)}
                      >
                        {entry.status === "new" ? "Mới" : "Đã xem"}
                      </span>
                    </div>
                    <CardTitle className="text-lg">
                      {entry.username || "Ẩn danh"}
                    </CardTitle>
                    <CardDescription>
                      {format(entry.createdAt, "HH:mm - dd/MM/yyyy", { locale: vi })}
                    </CardDescription>
                  </div>

                  <form action={updateEntryStatusAction} className="flex gap-2">
                    <input type="hidden" name="id" value={entry.id} />
                    <input
                      type="hidden"
                      name="status"
                      value={entry.status === "new" ? "reviewed" : "new"}
                    />
                    <Button type="submit" variant="outline" size="sm">
                      {entry.status === "new" ? "Đánh dấu đã xem" : "Đánh dấu mới lại"}
                    </Button>
                  </form>
                </div>
              </CardHeader>

              <CardContent className="space-y-3 px-4 py-3">
                <p className="whitespace-pre-wrap text-sm leading-6">{entry.message}</p>

                <div className="grid gap-2 text-sm text-muted-foreground sm:grid-cols-2 lg:grid-cols-3">
                  <div>
                    <span className="font-medium text-foreground">Email:</span>{" "}
                    {entry.email || "Không có"}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">Trang:</span>{" "}
                    {entry.pagePath || "Không rõ"}
                  </div>
                  <div>
                    <span className="font-medium text-foreground">ID:</span>{" "}
                    {entry.id}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Pagination
        pagination={{
          totalItems: feedbackResult.totalItems,
          totalItemsPerPage: feedbackResult.pageSize,
          currentPage: feedbackResult.currentPage,
          totalPages: feedbackResult.totalPages,
        }}
        baseUrl={basePaginationUrl}
      />
    </div>
  );
}
