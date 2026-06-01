# Hướng dẫn xây dựng website phim với Next.js (App Router)

Tài liệu này dùng để **Antigravity** hiểu rõ cách xây dựng một website xem phim tương tự **phimlau.mom**, sử dụng stack hiện đại:

* **Next.js (mới nhất – App Router)**
* **Server Actions**
* **Tailwind CSS**
* **shadcn/ui**
* **API từ [https://ophim18.cc](https://ophim18.cc)**

Mục tiêu: UI mượt, SEO tốt, load nhanh, dễ mở rộng.

---

## 0. Load skills trước khi thực hiện

Antigravity cần nắm vững các kỹ năng sau **trước khi code**:

### Frontend / Next.js

* Next.js App Router (`app/`)
* Server Components vs Client Components
* Server Actions (`"use server"`)
* Dynamic routes (`[slug]`, `[episode]`)
* Metadata API (SEO)
* Streaming & Suspense

### UI / Styling

* Tailwind CSS (responsive, dark mode)
* shadcn/ui (Button, Card, Dialog, Tabs, Skeleton)
* Radix UI (modal, dropdown)
* clsx / cn utility

### Data & Performance

* Fetch API với cache (`cache`, `revalidate`, `no-store`)
* Image optimization (`next/image`)
* Infinite scroll / pagination

### Others

* SEO cho web phim
* Accessibility cơ bản
* Clean folder structure

---

## 1. Phân tích tổng thể website phim

### Các trang chính

1. **Trang chủ**

   * Phim mới cập nhật
   * Phim bộ
   * Phim lẻ
   * Anime
   * Banner / carousel phim nổi bật

2. **Trang danh sách phim**

   * Lọc theo:

     * Thể loại
     * Quốc gia
     * Năm
     * Trạng thái (đang chiếu / hoàn thành)
   * Phân trang hoặc infinite scroll

3. **Trang chi tiết phim**

   * Poster
   * Tên phim
   * Mô tả
   * Thể loại, năm, quốc gia
   * Danh sách tập phim

4. **Trang xem phim**

   * Video player
   * Danh sách tập
   * Gợi ý phim liên quan

5. **Search**

   * Tìm phim theo tên

---

## 2. Cấu trúc thư mục đề xuất

```
app/
├─ layout.tsx
├─ page.tsx (Trang chủ)
├─ loading.tsx
├─ error.tsx
│
├─ phim/
│  └─ [slug]/
│     ├─ page.tsx (Chi tiết phim)
│     └─ loading.tsx
│
├─ xem-phim/
│  └─ [slug]/[episode]/
│     └─ page.tsx
│
├─ the-loai/[slug]/page.tsx
├─ quoc-gia/[slug]/page.tsx
├─ tim-kiem/page.tsx
│
components/
├─ movie/
│  ├─ MovieCard.tsx
│  ├─ MovieGrid.tsx
│  ├─ EpisodeList.tsx
│  └─ Player.tsx
│
├─ layout/
│  ├─ Header.tsx
│  ├─ Footer.tsx
│  └─ MobileNav.tsx
│
lib/
├─ ophim.ts (fetch API)
├─ utils.ts
│
styles/
└─ globals.css
```

---

## 3. Kết nối API ophim18

### Base URL

```
https://ophim18.cc/api
```

### Ví dụ endpoints

* Phim mới:

```
GET /danh-sach/phim-moi-cap-nhat?page=1
```

* Chi tiết phim:

```
GET /phim/{slug}
```

* Tìm kiếm:

```
GET /tim-kiem?keyword=naruto&page=1
```

---

## 4. Tầng fetch dữ liệu (Server-side)

**lib/ophim.ts**

* Tất cả fetch đều chạy trong **Server Components**
* Dùng cache hợp lý:

  * Trang chủ: `revalidate: 60`
  * Trang phim: `revalidate: 3600`
  * Xem phim: `no-store`

Ví dụ logic:

* `getLatestMovies(page)`
* `getMovieDetail(slug)`
* `searchMovies(keyword, page)`

---

## 5. Trang chủ (Home)

### UI layout

* Header sticky
* Banner phim nổi bật (carousel)
* Các section:

  * Phim mới cập nhật
  * Phim bộ mới
  * Phim lẻ mới

### Component sử dụng

* `MovieCard`
* `MovieGrid`
* `Skeleton` (shadcn)

### SEO

* Title động
* Meta description
* OpenGraph image

---

## 6. Trang chi tiết phim

### Nội dung hiển thị

* Poster (next/image)
* Thông tin phim
* Nội dung mô tả (HTML từ API)
* Danh sách tập phim (grid hoặc tabs)

### UX

* Tập mới nhất highlight
* Nút "Xem ngay"

---

## 7. Trang xem phim

### Video Player

* iframe hoặc HLS source từ API
* Aspect ratio 16:9
* Auto focus

### Danh sách tập

* Scrollable
* Active episode state

### Performance

* Không cache
* Client Component cho player

---

## 8. Search & Filter

* Search input debounce
* Query params sync URL
* Server fetch theo keyword

---

## 9. Styling & Theme

* Dark mode mặc định
* Tailwind config tối ưu cho media
* shadcn/ui dùng cho:

  * Button
  * Tabs
  * Dialog
  * Skeleton

---

## 10. SEO & tối ưu

* Metadata API cho từng trang phim
* URL thân thiện
* Sitemap & robots
* Lazy load images

---

## 11. Checklist hoàn thiện

* [ ] Responsive mobile
* [ ] Skeleton loading
* [ ] Error boundary
* [ ] SEO metadata
* [ ] Performance Lighthouse > 90

---

## 12. Nguyên tắc code

* Server Components mặc định
* Client Components chỉ khi cần
* Không fetch trong client nếu không bắt buộc
* UI tách nhỏ, tái sử dụng

---

Tài liệu này là blueprint để Antigravity triển khai web phim hoàn chỉnh bằng Next.js hiện đại.
