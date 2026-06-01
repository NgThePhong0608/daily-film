import UserLibraryList from "@/components/movie/UserLibraryList";
import { Bell } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phim Đang Theo Dõi - Daily Film",
  description: "Danh sách phim bạn đang theo dõi",
};

export default function FollowsPage() {
  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-8">
        <Bell className="h-6 w-6 text-blue-500 fill-current" />
        <h1 className="text-2xl font-bold">Phim Đang Theo Dõi</h1>
      </div>

      <UserLibraryList
        type="follows"
      />
    </div>
  );
}
