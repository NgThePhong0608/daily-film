# Đề xuất nâng cấp & hoàn thiện website phim (dùng cho Antigravity)

Tài liệu này bổ sung **các đề xuất quan trọng** ngoài phần build cơ bản, nhằm giúp website phim:

* Giữ người dùng lâu hơn
* Trải nghiệm xem tốt hơn phimlau.mom
* Dễ scale & tối ưu SEO lâu dài

Antigravity cần đọc tài liệu này **sau khi đã nắm blueprint build cơ bản**.

---

## 0. Nguyên tắc triển khai

* Không làm tất cả cùng lúc
* Ưu tiên theo **impact thực tế**
* MVP trước → nâng cấp dần

---

## 1. Trải nghiệm người dùng (UX) – Ưu tiên cao

### 1.1 Continue Watching (Tiếp tục xem)

**Mục tiêu**: Giúp user quay lại và xem tiếp nhanh.

**Yêu cầu**:

* Lưu:

  * `movieSlug`
  * `episodeSlug`
  * `currentTime` (optional)
* Storage:

  * `localStorage` (anonymous user)

**Hiển thị**:

* Section riêng trên homepage
* Card giống MovieCard nhưng có badge `Đang xem`

---

### 1.2 Đánh dấu tập đã xem

**Yêu cầu**:

* Episode đã xem → state `watched`
* UI:

  * mờ
  * icon ✓

**Logic**:

* Lưu danh sách episode đã xem theo movieSlug

---

## 2. Video Player nâng cao (Rất quan trọng)

### 2.1 Tính năng bắt buộc

* Auto next episode
* Ghi nhớ:

  * volume
  * playback speed
* Resume video tại thời điểm cũ

### 2.2 UX nâng cao

* Phím tắt:

  * Space: Play / Pause
  * ← →: Seek
* Focus mode (ẩn UI khi xem)

**Lưu ý kỹ thuật**:

* Player là **Client Component**
* Isolate logic, không leak state ra ngoài

---

## 3. Gợi ý phim liên quan (Retention)

**Rule-based recommendation**:

Ưu tiên theo thứ tự:

1. Cùng thể loại
2. Cùng quốc gia
3. Cùng năm

**UI**:

* Hiển thị dưới player
* Reuse MovieCard

---

## 4. SEO nâng cao (Rất nên làm)

### 4.1 Structured Data (JSON-LD)

Áp dụng cho:

* Movie
* TVSeries
* Episode

**Lợi ích**:

* Rich result
* Google hiểu rõ nội dung phim

---

### 4.2 Internal Linking

* Movie → Genre → Country → Year
* Breadcrumb schema

---

## 5. Performance & caching

### 5.1 Caching strategy

* Homepage: `revalidate: 60`
* Movie detail: `revalidate: 3600`
* Watch page: `no-store`

### 5.2 Rendering

* Dùng `Suspense` cho từng section
* Skeleton thay vì spinner

---

## 6. Chuẩn bị cho scale trong tương lai

### 6.1 Domain-based structure

```
/domain
 ├─ movie
 ├─ episode
 ├─ search
```

### 6.2 Dễ mở rộng

* User account
* Rating
* Comment
* Favorite list

---

## 7. Legal & an toàn

* Thêm trang:

  * Disclaimer
  * DMCA
* Option:

  * `noindex` trang watch nếu cần

---

## 8. Dark pattern cần tránh

* Auto play có tiếng
* Pop-up che player
* Redirect link bẩn

**Mục tiêu**: Web phim sạch, xem lâu, ít bỏ trang.

---

## 9. Roadmap đề xuất

### Phase 1 – MVP

* Xem phim ổn định
* UI clean
* SEO cơ bản

### Phase 2 – Retention

* Continue watching
* Gợi ý phim
* Player nâng cao

### Phase 3 – Scale

* Account
* Lịch sử xem
* Ranking / Trending

---

## 10. Yêu cầu với Antigravity

* Đi chậm, đúng kiến trúc
* Giải thích trước khi implement
* Không over-engineer
* Ưu tiên UX & performance

---

Tài liệu này dùng làm **spec nâng cấp chính thức** cho website phim.
