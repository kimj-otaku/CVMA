# PROJECT_STATE.md
## Chinese Vocabulary Memory App

---

## Project Goal
เว็บแอปส่วนตัวสำหรับช่วยจำคำศัพท์ภาษาจีน (Personal Chinese Vocabulary Memory Trainer)
เป้าหมาย: จำง่าย → จำเร็ว → นึกออกเอง → จำได้นาน → ใช้ภาษาจีนได้จริง

ผู้ใช้: นักศึกษาทุนจีน เรียนอยู่ในประเทศจีน ระดับ HSK 1–5 ใช้มือถือเป็นหลัก

---

## Current Phase
PHASE 4 COMPLETED
PHASE 5 IN PROGRESS — TASK 5.1 COMPLETED (Learning Session Flow)

## Current Task
รอคำสั่งเริ่ม TASK 5.2

## Completed Tasks
- [x] PHASE 1: Product Vision, Target User, Core User Flow, IA, Sitemap, Navigation, UX หน้าหลัก, UI Style, Palette, Typography, Component System, Memory Design, MVP Scope
- [x] PHASE 2: Low-fidelity Wireframe (Home, Chapters, Learn, Quick Review, Create Chapter) + Visual Design Tokens
- [x] PHASE 3 / 3.1 Home, 3.2 Chapters, 3.3 Vocabulary Card, 3.4 Learn Mode, 3.5 Quick Review, 3.6 Create Chapter (ฟอร์ม static, ปุ่มนำเข้ารูป disabled "เร็ว ๆ นี้")
- [x] PHASE 3 / 3.7 Navigation: Home→Learn / Quick Review / bottom-nav (หน้าแรก, บทเรียน, ทบทวน); Chapters→Learn / Create Chapter (FAB); Create Chapter (←/ยกเลิก/สร้างบท)→Chapters; Learn/Vocab Card ←→Chapters; Quick Review ←→Home (ใช้ location.href เท่านั้น)
- [x] PHASE 3 / 3.8 Responsive: ตรวจ 360/390/430/1280px ไม่มี horizontal scroll, ปุ่ม ≥44px, bottom-nav/FAB จำกัด 480px, ฟอนต์จีน fallback
- [x] PHASE 3 / 3.9 Final UX/UI Review: ดูรายละเอียดใน "Final Review Changes"
- [x] PHASE 4 / TASK 4.1 Vocabulary Data System: สร้างโครงสร้างข้อมูลกลาง (Chapter / Vocabulary / Vocabulary Progress) ที่ `/data/vocab-data.js` — ยังไม่ได้เชื่อมกับหน้า HTML (เชื่อมแล้วใน 4.2)
- [x] PHASE 4 / TASK 4.2 Connect Vocabulary Data to Chapters: chapters.html สร้างรายการบทจาก `VOCAB_DATA` (ชื่อบท, คำอธิบาย, จำนวนคำศัพท์, จำแล้ว/progress bar) กด Card → `chapter-detail.html?id=<Chapter ID>`; หน้า Chapter Detail (สร้างใหม่) โหลดคำศัพท์ด้วย `getVocabularyByChapter(id)` แสดง Hanzi/Pinyin/ความหมายไทย ผ่านโครงสร้าง `.vocab-card` เดิม; มี Empty/Error State (ไม่มีบท, ไม่พบ ID, ไม่ระบุ ID, บทไม่มีคำศัพท์, โหลดข้อมูลไม่สำเร็จ); Logic อยู่ใน `app.js` (route ตาม id ของ `<main class="page">`)
- [x] PHASE 4 / TASK 4.3 Connect Vocabulary Data to Learn Mode: learn.html โหลด `data/vocab-data.js` และดึง Chapter ID จาก `?chapter=` ใน URL; เชื่อม Flow Chapters → Chapter Detail → "เริ่มเรียน" → Learn Mode → โหลดคำศัพท์ของ Chapter นั้นด้วย `getVocabularyByChapter(id)`; Vocabulary Card แสดงข้อมูลจริงทั้งหมด (汉字, Pinyin, tag/หมวดหมู่, ระดับความยาก, ความหมายไทย, ตัวอย่างประโยค+คำแปล, Memory Tip) โดยยังคง UX เดิมของ TASK 3.4 ครบ (reveal ทีละขั้น, ปุ่ม "แตะเพื่อดูคำตอบ", "ยังจำไม่ได้", "จำได้แล้ว"); ปุ่ม "ยังจำไม่ได้"/"จำได้แล้ว" ใช้เปลี่ยนไปคำถัดไปของบทแบบวนรอบ (Prototype level ยังไม่บันทึกสถานะจริง) พร้อมอัปเดตหัวข้อ/progress bar/"คำที่ X / Y" ทุกครั้งที่เปลี่ยนคำ; มี Empty/Error State ครบ (ไม่มี Chapter ID, ไม่พบ Chapter, Chapter ไม่มีคำศัพท์, ไม่พบ Vocabulary ของ index นั้น, โหลดข้อมูลไม่สำเร็จ) โดยซ่อนเนื้อหา Learn Mode (`#learnBody`) แล้วแสดง state box แทน (`#learnStateBox`); Logic อยู่ใน `app.js` (`initLearn()`, route ตาม id `page-learn`)
- [x] PHASE 4 / TASK 4.4 Connect Vocabulary Data to Quick Review: quick-review.html โหลด `data/vocab-data.js` และไม่มีคำศัพท์ hard-code ใน HTML แล้ว (ช่องข้อมูลเป็น element ว่างที่มี id `review*`); ชุดคำทบทวน (Prototype) = ค่าเริ่มต้นใช้ `getAllVocabulary()` จำกัดไม่เกิน 12 คำ (`REVIEW_LIMIT`) หรือถ้าใส่ `?chapter=<id>` ใช้ `getVocabularyByChapter(id)` ของบทนั้น; การ์ดแสดง 汉字, Pinyin, tag, ระดับความยาก, ความหมายไทย, ตัวอย่างประโยค+คำแปล, Memory Tip จากข้อมูลจริง; UX เดิมของ TASK 3.5 ครบ (แตะเพื่อดูคำตอบ → ปุ่มยังจำไม่ได้/จำได้แล้ว, คำก่อนหน้า/คำถัดไป, progress bar + "X / Y คำ" อัปเดตทุกคำ); ปุ่มยังจำไม่ได้/จำได้แล้ว/คำถัดไป ไปคำถัดไปแบบวนรอบ, คำก่อนหน้าย้อนกลับแบบวนรอบ (ยังไม่บันทึก Progress); มี Empty/Error State (โหลดข้อมูลไม่สำเร็จ, ไม่พบ Chapter, ไม่มีคำศัพท์, ไม่พบคำนั้น) แสดงใน `#reviewStateBox` แทน `#reviewBody`; Logic อยู่ใน `app.js` (`initQuickReview()`, route ตาม id `page-quick-review`)
- [x] PHASE 4 / TASK 4.5 Final Vocabulary Data System Check: ตรวจ Data Structure (Chapter/Vocabulary/ID/Progress), Data Flow (Chapter → Vocabulary → Learn → Quick Review), Empty/Error State ทุกหน้า, การเพิ่มคำศัพท์ใหม่, hard-code ซ้ำ, โครงสร้างไฟล์ — ผ่านทั้งหมด (ทดสอบอัตโนมัติ 46 กรณี + ตรวจข้อมูล) แก้เฉพาะจุดเล็ก: `Chapter.vocabularyIds` สร้างอัตโนมัติจาก `Vocabulary.chapterId` (ต้นทางข้อมูลจริงที่เดียว), Quick Review ข้ามคำที่ chapterId ไม่ตรงบทใด, header ของ Learn (`learn.html`) ไม่โชว์ "第1课 / คำที่ 1 / 1" ชั่วคราวก่อน JS ทำงาน/ตอนเป็น Empty State, ปรับ comment ใน app.js และ PROJECT_STATE.md
- [x] PHASE 5 / TASK 5.1 Learning Session Flow: Learn Mode (`learn.html?chapter=<id>`) เป็น Session แบบเชิงเส้น — Chapter Detail → เริ่มเรียน → คำที่ 1 … คำสุดท้าย → หน้า Session Complete ("🎉 เรียนครบแล้ว! / วันนี้เรียน N คำ" + ปุ่ม "กลับบท" → `chapter-detail.html?id=` และ "เรียนอีกครั้ง" → เริ่มที่คำแรก); ไม่วนรอบอีกแล้ว; ทุกครั้งที่เปลี่ยนคำ การ์ดรีเซ็ตกลับด้านหน้า, ข้อมูลคำก่อนหน้าถูกแทนที่, "คำที่ X / N" และ progress bar อัปเดต; UX 7 ขั้นเดิมครบ (汉字 → Pinyin → ปุ่มฟังเสียง placeholder → ข้อความชวนนึก → แตะเพื่อดูคำตอบ → ความหมาย/ตัวอย่าง/คำแปล/Memory Tip → ยังจำไม่ได้/จำได้แล้ว); ปุ่ม ← ในหัวกลับไปหน้ารายละเอียดบท (Session อยู่เป็น state ในหน้าเท่านั้น เข้าใหม่เริ่มคำแรกเสมอ); Empty/Error State เดิมครบ (ไม่มี Chapter ID, ไม่พบ Chapter, Chapter ไม่มีคำศัพท์, โหลดข้อมูลไม่สำเร็จ); แก้เฉพาะ `app.js` (`initLearn()`: `goToNext`, `showComplete`), `learn.html` (id ปุ่ม ←), `style.css` (`.state-actions`); ไม่มีข้อมูลคำศัพท์ชุดใหม่ ใช้ `getVocabularyByChapter()` จาก Data กลาง

## Final Review Changes (3.9)
- คำเรียกสอดคล้อง: nav "บทเรียน" = หัวหน้า Chapters; "ทบทวนวันนี้" = ปุ่มใน Home = หัวหน้า Quick Review
- ปุ่ม primary/secondary และ FAB เปลี่ยนตัวอักษรขาว → text-dark (คอนทราสต์); .tag/listen-btn ม่วงเข้มขึ้น (#6F55A0); --text-muted #8A8A8A → #757575; ข้อความไทยในการ์ด (คำแปลประโยค, hint, memory tip) 14 → 15px
- เมนู "ความคืบหน้า" เป็น disabled (ยังไม่มีหน้า) ; active nav label เข้มขึ้น
- vocab-card.html ใช้ .icon-spacer เหมือนหน้าอื่น

## Known Issues / Placeholder
- "จำแล้ว" ในหน้า Chapters/Detail นับจาก Progress `status === "mastered"` (ข้อมูลปัจจุบันยังเป็น 0 ทุกบท เพราะยังไม่มี Logic อัปเดต Progress); ปุ่ม "จำได้แล้ว"/"ยังจำไม่ได้" ใน Learn Mode (TASK 4.3) ยังแค่เปลี่ยนคำถัดไป ไม่ได้บันทึกสถานะจริงลง Progress (ตามข้อจำกัดของ Task — ยังไม่ทำ Local Storage/SRS จริง)
- ชื่อบทแสดงจาก `title` อย่างเดียว (ข้อมูลกลางยังไม่มีฟิลด์ชื่อไทยเช่น "บทที่ 1" และไม่มีคำอธิบายของ ch-002)
- ยังไม่มีหน้า Progress + Streak (nav disabled)
- ปุ่ม คำก่อนหน้า (Learn Mode ไม่มี — ไปได้เฉพาะคำถัดไปผ่านปุ่มจำได้/ยังไม่ได้), สร้างบท, ฟังเสียง, SRS rating เป็น UI เท่านั้น ยังไม่มี Logic
- vocab-card.html เป็นหน้า demo ของ component (ไม่มีลิงก์เข้าจากเมนู) และยังใช้ข้อความ static (ยังไม่เชื่อมกับ `data/vocab-data.js`)
- ยังไม่ทดสอบบนมือถือจริง
- index.html, vocab-card.html (และ create-chapter.html ที่เป็นฟอร์มตัวอย่าง) ยังคงมีข้อความ/ตัวเลขแบบ static ฝังอยู่ (ยังไม่ได้เชื่อมกับ `data/vocab-data.js` — เป็นงานของ Task ถัดไป) ส่วน chapters.html, chapter-detail.html, learn.html และ quick-review.html ไม่มีข้อมูลคำศัพท์/บทฝังใน HTML แล้ว
- Quick Review ตอนนี้ยังไม่เลือกคำตาม nextReview/SRS (ใช้คำจากข้อมูลกลางตามลำดับ สูงสุด 12 คำ) และข้อมูลกลางมีเพียง 3 คำ จึงแสดง "X / 3 คำ"; Home ยังลิงก์ quick-review.html แบบไม่ส่ง `?chapter=`
- ch-002 (第2课) ในข้อมูลกลางยังไม่มีคำศัพท์จริง (vocabularyIds ว่าง) เพราะ Static Prototype ไม่มีข้อมูลตัวอย่างของบทนี้ — ใช้ทดสอบ Empty State ของ Learn Mode ได้ผ่าน `learn.html?chapter=ch-002`

## Current Features (ยืนยันแล้ว ยังไม่ได้ Build)
- Home (สรุปสิ่งที่ต้องทำวันนี้)
- Chapters + Chapter Detail
- Learn Mode (แสดงข้อมูลทีละขั้น)
- Flashcard
- Active Recall (เลือกความหมาย / ฟังเสียง / เห็นรูป / พิมพ์ Pinyin)
- Quick Review
- Spaced Repetition (แบบง่าย 5 ระดับ)
- Progress + Streak
- Create Chapter (พิมพ์เอง)
- Import Image → Review OCR (เตรียมระบบ, ยังไม่มี OCR จริง)

## File Structure
```
/index.html       (หน้า Home เสร็จแล้ว)
/chapters.html    (หน้า Chapters — TASK 4.2: รายการบทสร้างจาก VOCAB_DATA ผ่าน app.js, กด Card → chapter-detail.html?id=...)
/chapter-detail.html (TASK 4.2 ใหม่ — รายละเอียดบท + รายการคำศัพท์ตาม Chapter ID ใน query string `?id=`)
/vocab-card.html  (Vocabulary Card แบบ Static เสร็จแล้ว - demo หน้า/หลังการ์ด + SRS rating)
/learn.html       (TASK 4.3/5.1 — Learning Session: โหลดคำศัพท์จาก VOCAB_DATA ตาม Chapter ID ใน query string `?chapter=`, reveal ทีละขั้น + ปุ่มจำได้/ยังไม่ได้ (เปลี่ยนคำถัดไป) + Empty/Error State)
/create-chapter.html (Create Chapter แบบ Static เสร็จแล้ว - ฟอร์มสร้างบท + เพิ่มคำศัพท์)
/quick-review.html (TASK 4.4 — โหลดคำศัพท์จาก VOCAB_DATA (ทั้งหมดสูงสุด 12 คำ หรือ `?chapter=`), ใช้ component จาก Learn Mode ซ้ำ + review-nav + Empty/Error State)
/style.css        (Design Token + สไตล์ Home + Chapters + Vocabulary Card + Learn Mode + Quick Review + Create Chapter form + 4.2: chapter-desc, vocab-card-compact, state-box)
/app.js           (TASK 4.2 — render Chapters + Chapter Detail จาก VOCAB_DATA + Empty/Error State; TASK 4.3 — render Learn Mode (initLearn) จาก VOCAB_DATA ตาม ?chapter=, เปลี่ยนคำถัดไป + Empty/Error State; TASK 4.4 — initQuickReview(); หน้าอื่นไม่ถูกกระทบ)
/data/vocab-data.js  (TASK 4.1 — ข้อมูลกลาง Chapter/Vocabulary/Progress + getter functions, ผูกกับ window.VOCAB_DATA)
```

## Data Structure (TASK 4.1)
ไฟล์: `/data/vocab-data.js` (ต้องโหลดก่อน app.js: `<script src="data/vocab-data.js"></script>`) — เก็บเป็น JavaScript Object (ผูกกับ `window.VOCAB_DATA`) แทน JSON
เพื่อให้เปิดใช้งานได้ตรงจากไฟล์ (`file://`) โดยไม่ต้องมี server/`fetch`

```js
// Chapter
{
  "id": "ch-001",
  "title": "第1课",
  "description": "คำศัพท์พื้นฐาน HSK1 — คน/บุคคล",
  "vocabularyIds": ["vocab-001", "vocab-002", "vocab-003"],   // สร้างอัตโนมัติจาก Vocabulary.chapterId ตอนโหลด ไม่ต้องเขียนเอง
  "createdAt": "2026-09-24T00:00:00.000Z"
}

// Vocabulary
{
  "id": "vocab-001",
  "chapterId": "ch-001",
  "hanzi": "老师",
  "pinyin": "lǎoshī",
  "meaning_th": "ครู",
  "example": "老师教我们中文。",
  "example_th": "ครูสอนภาษาจีนให้เรา",
  "memory_tip": "老 + 师 → 老师 = ครู",
  "category": "人物",
  "difficulty": 1
}

// Vocabulary Progress (แยกออกจาก Vocabulary, key = vocabulary id)
"vocab-001": {
  "status": "learning",
  "reviewCount": 0,
  "lastReviewed": null,
  "nextReview": null
}
```

Getter functions ที่มีให้ใช้: `getAllChapters()`, `getChapterById(id)`, `getAllVocabulary()`,
`getVocabularyById(id)`, `getVocabularyByChapter(chapterId)`, `getProgress(vocabId)`

## Important Decisions
- ใช้ HTML+CSS+JS ธรรมดาก่อน (เบากว่า React) สำหรับ Prototype เริ่มต้น
- เก็บข้อมูลด้วย localStorage
- ไม่มี Backend / Auth / AI API ใน MVP
- Image Import ช่วงแรกใช้วิธีส่งภาพให้ Claude อ่านนอกระบบ (ไม่ทำ OCR ในเว็บ)
- Spaced Repetition ใช้สูตรง่าย 5 ระดับ (วันนี้ / 1 วัน / 3 วัน / 7 วัน / 14 วัน)
- Palette (hex ยืนยันแล้ว): bg `#FFF8F3`, surface `#FFFFFF`, primary `#F7A8C4`, secondary `#C9B6E4`, info `#A8D8E8`, text dark `#3A3A3A`, text muted `#8A8A8A`, success `#8FD19E`, warning `#F5D67A`, danger `#F29191`
- Typography: Hanzi Display 40–48px, Hanzi Body 22–24px, Pinyin 16px italic, Heading 20px bold, Body 15–16px, Caption 12–13px
- Spacing scale 4/8/12/16/24/32px, Card radius 16–20px, Button radius 12px, Shadow `0 2px 8px rgba(0,0,0,0.06)`, ปุ่มสูงขั้นต่ำ 48px

## Known Bugs
- ไม่พบบัคจากการตรวจ TASK 4.5 (ยังไม่ได้ทดสอบบนมือถือจริง)

## Next Task
TASK 5.2 (รอคำสั่งเริ่ม) — ข้อเสนอเดิมของ Phase 5 ที่ยังไม่ทำ (Learning Session 5.1 เสร็จแล้ว) — Data System พร้อมใช้งานแล้ว ข้อเสนอสำหรับงานที่ค้างจาก Phase 4:
- Local Storage: บันทึก Vocabulary Progress (status/reviewCount/lastReviewed/nextReview) + ผลจำได้/ยังไม่ได้ จากปุ่มใน Learn/Quick Review
- Spaced Repetition 5 ระดับ + เลือกคำใน Quick Review ตาม nextReview (แทน "ทุกคำ สูงสุด 12")
- เชื่อม Home (ชื่อบทที่กำลังเรียน, X / Y คำ, ตัวเลขวันนี้ต้องทบทวน) และหน้า Create Chapter กับ VOCAB_DATA
- หน้า Progress + Streak

## Development Notes
- ทำงานทีละ Task ตามกฎ Claude Free Optimization Protocol
- ตอบเป็นภาษาไทยเป็นหลักเสมอ
- ห้ามข้าม Phase, ห้ามทำ Task ถัดไปเอง
