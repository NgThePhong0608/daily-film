import UserLibraryList from "@/components/movie/UserLibraryList";
import { Heart } from "lucide-react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Phim Yêu Thích - Daily Film",
  description: "Danh sách phim bạn đã yêu thích",
};

export default function FavoritesPage() {
  return (
    <div className="container py-8">
      <div className="flex items-center gap-2 mb-8">
        <Heart className="h-6 w-6 text-red-500 fill-current" />
        <h1 className="text-2xl font-bold">Phim Yêu Thích</h1>
      </div>

      <UserLibraryList
        type="favorites"
      />
    </div>
  );
}
