/* ============================================================
   VOCAB DATA — โครงสร้างข้อมูลกลาง (Central Data Store)
   TASK 4.1: Vocabulary Data System
   ============================================================
   ไฟล์นี้เก็บข้อมูล Chapter / Vocabulary / Vocabulary Progress
   ไว้ที่เดียว เพื่อให้หน้า Home, Chapters, Learn Mode, Quick Review
   และหน้าอื่น ๆ ในอนาคต เรียกใช้ข้อมูลชุดเดียวกันได้ โดยไม่ต้อง
   เขียนคำศัพท์ซ้ำในแต่ละไฟล์ HTML

   สถานะปัจจุบัน:
   - เป็นเพียง "โครงสร้างข้อมูล" (Data Layer) เท่านั้น
   - เชื่อมกับ chapters.html, chapter-detail.html (4.2), learn.html (4.3),
     quick-review.html (4.4) แล้วผ่าน app.js — หน้า Home ยังเป็นข้อความ static
   - ยังไม่มี Local Storage / IndexedDB / Spaced Repetition จริง
   - ฟังก์ชันที่แนบมาเป็นเพียง getter อ่านข้อมูลอย่างง่าย ไม่มี logic อื่น

   วิธีใช้ (สำหรับอนาคต):
   <script src="data/vocab-data.js"></script>
   แล้วเรียกผ่าน window.VOCAB_DATA เช่น
   VOCAB_DATA.getVocabularyByChapter('ch-001')
   ============================================================ */

(function (global) {
  "use strict";

  /* ------------------------------------------------------------
     1) CHAPTERS
     โครงสร้าง:
       id            string  รหัสบทเรียน (unique)
       title         string  ชื่อบทแบบจีน เช่น "第1课"
       description   string  คำอธิบายสั้น ๆ ของบท
       vocabularyIds string[] รายการ id ของคำศัพท์ในบทนี้ — "สร้างอัตโนมัติ" จาก
                             Vocabulary.chapterId ตอนโหลดไฟล์ (ข้อ 1.1) จึงไม่ต้องเขียนเอง
                             ต้นทางข้อมูลจริงมีที่เดียวคือ Vocabulary.chapterId
       createdAt     string  วันที่สร้างบท (ISO 8601)
  ------------------------------------------------------------ */
  var chapters = [
    {
      id: "ch-001",
      title: "第1课",
      description: "คำศัพท์พื้นฐาน HSK1 — คน/บุคคล",
      vocabularyIds: [],
      createdAt: "2026-09-24T00:00:00.000Z"
    },
    {
      id: "ch-002",
      title: "第2课",
      description: "",
      // ยังไม่มีคำศัพท์ที่มี chapterId = "ch-002" (ใช้ทดสอบ Empty State)
      vocabularyIds: [],
      createdAt: "2026-09-24T00:00:00.000Z"
    }
  ];

  /* ------------------------------------------------------------
     2) VOCABULARY
     โครงสร้าง:
       id           string  รหัสคำศัพท์ (unique)
       chapterId    string  รหัสบทที่คำนี้สังกัด (เชื่อมกับ Chapter.id)
       hanzi        string  ตัวอักษรจีน
       pinyin       string  พินอิน
       meaning_th   string  ความหมายภาษาไทย
       example      string  ตัวอย่างประโยคภาษาจีน
       example_th   string  คำแปลของตัวอย่างประโยค
       memory_tip   string  เทคนิคช่วยจำ
       category     string  หมวดหมู่คำศัพท์ เช่น "人物"
       difficulty   number  ระดับความยาก (1-3 ตาม UI จุดใน vocab-card)

     หมายเหตุ:
     - "老师" คือคำศัพท์ตัวอย่างเดิมที่ใช้ซ้ำอยู่ใน learn.html, quick-review.html,
       vocab-card.html จึงถูกย้ายมาไว้ที่นี่เป็น vocab-001 (ข้อมูลจริงจากโปรเจกต์)
     - vocab-002, vocab-003 เป็นคำศัพท์ HSK1 ทั่วไปที่เพิ่มเข้ามาเป็นตัวอย่างเพิ่มเติม
       เพื่อทดสอบว่าโครงสร้างรองรับหลายคำ/หลายบทได้จริง (ตามข้อ 6 ของ Task 4.1)
  ------------------------------------------------------------ */
  var vocabulary = [
    {
      id: "vocab-001",
      chapterId: "ch-001",
      hanzi: "老师",
      pinyin: "lǎoshī",
      meaning_th: "ครู",
      example: "老师教我们中文。",
      example_th: "ครูสอนภาษาจีนให้เรา",
      memory_tip: "老 + 师 → 老师 = ครู",
      category: "人物",
      difficulty: 1
    },
    {
      id: "vocab-002",
      chapterId: "ch-001",
      hanzi: "学生",
      pinyin: "xuéshēng",
      meaning_th: "นักเรียน",
      example: "我是学生。",
      example_th: "ฉันเป็นนักเรียน",
      memory_tip: "学 (เรียน) + 生 (คน) → 学生 = นักเรียน",
      category: "人物",
      difficulty: 1
    },
    {
      id: "vocab-003",
      chapterId: "ch-001",
      hanzi: "朋友",
      pinyin: "péngyou",
      meaning_th: "เพื่อน",
      example: "他是我的朋友。",
      example_th: "เขาเป็นเพื่อนของฉัน",
      memory_tip: "朋 + 友 (เพื่อนสองคนอยู่ด้วยกัน) → 朋友 = เพื่อน",
      category: "人物",
      difficulty: 1
    }
  ];

  /* 1.1) สร้าง Chapter.vocabularyIds จาก Vocabulary.chapterId อัตโนมัติ
     เพิ่มคำศัพท์ใหม่ = เพิ่ม object ใน vocabulary (ระบุ chapterId) ที่เดียวพอ */
  chapters.forEach(function (c) {
    c.vocabularyIds = vocabulary
      .filter(function (v) { return v.chapterId === c.id; })
      .map(function (v) { return v.id; });
  });

  /* ------------------------------------------------------------
     3) VOCABULARY PROGRESS (เบื้องต้น)
     เก็บแยกจาก Vocabulary เพราะเป็นข้อมูล "สถานะการเรียนรู้" ของผู้ใช้
     ซึ่งจะเปลี่ยนบ่อยกว่าตัวคำศัพท์เอง (เหมาะกับการย้ายไป Local Storage
     หรือ IndexedDB แยกต่างหากในอนาคต โดยไม่กระทบข้อมูลคำศัพท์)

     key = vocabulary id
     โครงสร้างของแต่ละ record:
       status        string  "new" | "learning" | "reviewing" | "mastered"
       reviewCount   number  จำนวนครั้งที่ทบทวนแล้ว
       lastReviewed  string|null  วันที่ทบทวนล่าสุด (ISO 8601) หรือ null ถ้ายังไม่เคย
       nextReview    string|null  วันที่ควรทบทวนครั้งถัดไป หรือ null ถ้ายังไม่กำหนด
       (ยังไม่มีการคำนวณ Spaced Repetition จริงในเฟสนี้)
  ------------------------------------------------------------ */
  var vocabularyProgress = {
    "vocab-001": {
      status: "learning",
      reviewCount: 0,
      lastReviewed: null,
      nextReview: null
    },
    "vocab-002": {
      status: "new",
      reviewCount: 0,
      lastReviewed: null,
      nextReview: null
    },
    "vocab-003": {
      status: "new",
      reviewCount: 0,
      lastReviewed: null,
      nextReview: null
    }
  };

  /* ------------------------------------------------------------
     4) GETTER ฟังก์ชันอ่านข้อมูลอย่างง่าย (read-only, ไม่มี logic อื่น)
  ------------------------------------------------------------ */
  function getAllChapters() {
    return chapters;
  }

  function getChapterById(chapterId) {
    for (var i = 0; i < chapters.length; i++) {
      if (chapters[i].id === chapterId) return chapters[i];
    }
    return null;
  }

  function getAllVocabulary() {
    return vocabulary;
  }

  function getVocabularyById(vocabId) {
    for (var i = 0; i < vocabulary.length; i++) {
      if (vocabulary[i].id === vocabId) return vocabulary[i];
    }
    return null;
  }

  function getVocabularyByChapter(chapterId) {
    return vocabulary.filter(function (v) {
      return v.chapterId === chapterId;
    });
  }

  function getProgress(vocabId) {
    return vocabularyProgress[vocabId] || null;
  }

  /* ------------------------------------------------------------
     5) EXPORT — ผูกกับ window เพื่อให้ทุกหน้า HTML เรียกใช้ร่วมกันได้
        ผ่าน <script src="data/vocab-data.js"></script>
  ------------------------------------------------------------ */
  global.VOCAB_DATA = {
    chapters: chapters,
    vocabulary: vocabulary,
    vocabularyProgress: vocabularyProgress,
    getAllChapters: getAllChapters,
    getChapterById: getChapterById,
    getAllVocabulary: getAllVocabulary,
    getVocabularyById: getVocabularyById,
    getVocabularyByChapter: getVocabularyByChapter,
    getProgress: getProgress
  };

})(typeof window !== "undefined" ? window : globalThis);
