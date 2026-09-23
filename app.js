/* ============================================================
   APP.JS — Logic กลางของแอป
   TASK 4.2: เชื่อม Chapters / Chapter Detail กับข้อมูลกลาง (VOCAB_DATA)
   TASK 4.3: เชื่อม Learn Mode (learn.html?chapter=<id>) กับ VOCAB_DATA
   TASK 4.4: เชื่อม Quick Review (quick-review.html[?chapter=<id>]) กับ VOCAB_DATA
   TASK 5.1: Learning Session ใน Learn Mode (ไล่ทีละคำ → Session Complete → เรียนอีกครั้ง/กลับบท)
   ============================================================
   - อ่านข้อมูลผ่าน window.VOCAB_DATA (data/vocab-data.js) เท่านั้น
     ไม่มีคำศัพท์/บทเรียนถูกเขียนซ้ำในไฟล์นี้หรือใน HTML
   - ไฟล์นี้ถูกโหลดในทุกหน้า: ตรวจจาก id ของ <main class="page">
     แล้วทำงานเฉพาะหน้าที่เกี่ยวข้อง (หน้าอื่นไม่ถูกกระทบ)
   - Flow: Chapters → (Chapter ID ใน URL ?id=...) → Chapter Detail
           → เริ่มเรียน → Learn Mode (?chapter=<id>)
           → getVocabularyByChapter(Chapter ID)
     Quick Review (Home → quick-review.html): ทุกคำจาก getAllVocabulary()
           (สูงสุด 12) หรือเฉพาะบทด้วย ?chapter=<id>
   - เพิ่มคำศัพท์ใหม่: เพิ่ม object ใน vocabulary ของ data/vocab-data.js ที่เดียว
   - ยังไม่มี Local Storage / SRS จริง (Progress อ่านจาก VOCAB_DATA อย่างเดียว
     สถานะ "จำได้แล้ว/ยังจำไม่ได้" ใน Learn Mode / Quick Review ยังไม่ถูกบันทึก แค่เปลี่ยนคำ)
   ============================================================ */

(function () {
  "use strict";

  var DATA = window.VOCAB_DATA || null;

  /* ---------- Helpers ---------- */

  // สร้าง element ด้วย textContent (ไม่ใช้ innerHTML กับข้อมูล)
  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined && text !== null) node.textContent = text;
    return node;
  }

  function clear(node) {
    while (node.firstChild) node.removeChild(node.firstChild);
  }

  function go(url) {
    location.href = url;
  }

  // Empty / Error state ใช้ร่วมกันทุกกรณี
  function stateBox(icon, title, text, actionLabel, actionUrl) {
    var box = el("section", "card state-box");
    box.appendChild(el("div", "state-icon", icon));
    box.appendChild(el("h2", "state-title", title));
    box.appendChild(el("p", "state-text", text));
    if (actionLabel && actionUrl) {
      var btn = el("button", "btn btn-secondary", actionLabel);
      btn.type = "button";
      btn.addEventListener("click", function () { go(actionUrl); });
      box.appendChild(btn);
    }
    return box;
  }

  function dataErrorBox() {
    return stateBox(
      "⚠️",
      "โหลดข้อมูลไม่สำเร็จ",
      "ไม่พบข้อมูลคำศัพท์ (data/vocab-data.js) กรุณาตรวจสอบไฟล์แล้วลองใหม่",
      "กลับหน้าแรก",
      "index.html"
    );
  }

  // สถิติของบท: ดึงคำศัพท์ตาม Chapter ID จาก Data กลาง
  // "จำแล้ว" = คำที่ Progress status เป็น "mastered"
  function getChapterStats(chapterId) {
    var vocab = DATA.getVocabularyByChapter(chapterId);
    var mastered = 0;
    for (var i = 0; i < vocab.length; i++) {
      var p = DATA.getProgress(vocab[i].id);
      if (p && p.status === "mastered") mastered++;
    }
    var percent = vocab.length > 0 ? Math.round((mastered / vocab.length) * 100) : 0;
    return { vocab: vocab, total: vocab.length, mastered: mastered, percent: percent };
  }

  function progressBar(percent) {
    var bar = el("div", "progress-bar");
    var fill = el("div", "progress-fill");
    fill.style.width = percent + "%";
    bar.appendChild(fill);
    return bar;
  }

  /* ============================================================
     หน้า Chapters (chapters.html)
     ============================================================ */
  function initChapters() {
    var list = document.getElementById("chapterList");
    if (!list) return;
    clear(list);

    if (!DATA) {
      list.appendChild(dataErrorBox());
      return;
    }

    var chapters = DATA.getAllChapters();
    if (!chapters || chapters.length === 0) {
      list.appendChild(stateBox(
        "📭",
        "ยังไม่มีบทเรียน",
        "ตอนนี้ยังไม่มีบทเรียนในระบบ กดปุ่ม ＋ มุมขวาล่างเพื่อสร้างบทใหม่",
        null,
        null
      ));
      return;
    }

    chapters.forEach(function (chapter) {
      var stats = getChapterStats(chapter.id);

      var card = el("article", "card card-chapter is-clickable");
      card.setAttribute("data-chapter-id", chapter.id);

      card.appendChild(el("h2", "chapter-title", chapter.title));

      if (chapter.description) {
        card.appendChild(el("p", "chapter-desc", chapter.description));
      } else {
        card.appendChild(el("p", "chapter-desc is-empty", "ยังไม่มีคำอธิบาย"));
      }

      var meta = el("div", "chapter-meta");
      meta.appendChild(el("span", null, "📚 " + stats.total + " คำศัพท์"));
      if (stats.total > 0) {
        meta.appendChild(el("span", null, "⭐ จำแล้ว " + stats.mastered + " คำ"));
      }
      card.appendChild(meta);

      if (stats.total > 0) {
        card.appendChild(progressBar(stats.percent));
      } else {
        card.appendChild(el("p", "chapter-desc is-empty", "ยังไม่มีคำศัพท์ในบทนี้"));
      }

      var btn = el("button", "btn btn-primary", "ดูบทเรียน");
      btn.type = "button";
      card.appendChild(btn);

      // กดที่ Card (รวมถึงปุ่ม) → Chapter Detail ตาม Chapter ID
      card.addEventListener("click", function () {
        go("chapter-detail.html?id=" + encodeURIComponent(chapter.id));
      });

      list.appendChild(card);
    });
  }

  /* ============================================================
     หน้า Chapter Detail (chapter-detail.html?id=<Chapter ID>)
     ============================================================ */
  function renderVocabItem(v) {
    var card = el("section", "vocab-card vocab-card-compact is-revealed");

    var top = el("div", "vocab-card-top");
    if (v.category) top.appendChild(el("span", "tag", v.category));
    var diff = el("span", "difficulty");
    diff.setAttribute("aria-label", "ระดับความยาก");
    var level = Number(v.difficulty) || 0;
    for (var i = 1; i <= 3; i++) {
      diff.appendChild(el("span", i <= level ? "dot dot-filled" : "dot"));
    }
    top.appendChild(diff);
    card.appendChild(top);

    var face = el("div", "vocab-card-face vocab-card-back");
    face.appendChild(el("div", "vocab-hanzi vocab-hanzi-sm", v.hanzi));
    face.appendChild(el("div", "vocab-pinyin", v.pinyin));
    face.appendChild(el("div", "vocab-meaning", v.meaning_th));
    card.appendChild(face);

    return card;
  }

  function initChapterDetail() {
    var root = document.getElementById("chapterDetail");
    var titleEl = document.getElementById("detailTitle");
    var subEl = document.getElementById("detailSub");
    if (!root) return;
    clear(root);

    if (!DATA) {
      root.appendChild(dataErrorBox());
      return;
    }

    var chapterId = new URLSearchParams(location.search).get("id");

    if (!chapterId) {
      root.appendChild(stateBox(
        "🔎",
        "ไม่ได้ระบุบทเรียน",
        "กรุณาเลือกบทจากหน้าบทเรียน",
        "กลับไปหน้าบทเรียน",
        "chapters.html"
      ));
      return;
    }

    var chapter = DATA.getChapterById(chapterId);
    if (!chapter) {
      root.appendChild(stateBox(
        "🔎",
        "ไม่พบบทเรียนนี้",
        "ไม่พบบทเรียนรหัส \"" + chapterId + "\" อาจถูกลบหรือลิงก์ไม่ถูกต้อง",
        "กลับไปหน้าบทเรียน",
        "chapters.html"
      ));
      return;
    }

    var stats = getChapterStats(chapter.id);

    // Header + ชื่อแท็บ
    if (titleEl) titleEl.textContent = chapter.title;
    if (subEl) subEl.textContent = stats.total + " คำศัพท์";
    document.title = chapter.title + " — จำศัพท์จีน";

    // สรุปบท: ชื่อ / คำอธิบาย / จำนวนคำศัพท์ / progress
    var summary = el("section", "card card-chapter");
    summary.appendChild(el("h2", "chapter-title", chapter.title));
    summary.appendChild(el(
      "p",
      chapter.description ? "chapter-desc" : "chapter-desc is-empty",
      chapter.description || "ยังไม่มีคำอธิบาย"
    ));

    var meta = el("div", "chapter-meta");
    meta.appendChild(el("span", null, "📚 " + stats.total + " คำศัพท์"));
    if (stats.total > 0) {
      meta.appendChild(el("span", null, "⭐ จำแล้ว " + stats.mastered + " คำ"));
    }
    summary.appendChild(meta);

    if (stats.total > 0) {
      summary.appendChild(progressBar(stats.percent));
    }

    var startBtn = el("button", "btn btn-primary", "เริ่มเรียน");
    startBtn.type = "button";
    if (stats.total === 0) {
      startBtn.disabled = true;
    } else {
      // ส่ง Chapter ID ต่อไปให้ Learn Mode (learn.html อ่านค่านี้จาก ?chapter= — TASK 4.3)
      startBtn.addEventListener("click", function () {
        go("learn.html?chapter=" + encodeURIComponent(chapter.id));
      });
    }
    summary.appendChild(startBtn);
    root.appendChild(summary);

    // รายการคำศัพท์ของบท
    if (stats.total === 0) {
      root.appendChild(stateBox(
        "📝",
        "บทนี้ยังไม่มีคำศัพท์",
        "เมื่อเพิ่มคำศัพท์ให้บทนี้แล้ว รายการจะแสดงที่นี่",
        null,
        null
      ));
      return;
    }

    var head = el("div", "section-head");
    head.appendChild(el("div", "card-label", "รายการคำศัพท์"));
    root.appendChild(head);

    stats.vocab.forEach(function (v) {
      root.appendChild(renderVocabItem(v));
    });
  }

  /* ============================================================
     หน้า Learn Mode (learn.html?chapter=<Chapter ID>)
     TASK 4.3: เชื่อม Learn Mode กับ VOCAB_DATA + Chapter ที่เลือก
     ============================================================ */
  function setText(id, text) {
    var node = document.getElementById(id);
    if (node) node.textContent = text || "";
  }

  // tag ว่าง (ไม่มี category) → ซ่อนไว้แทนที่จะโชว์ pill ว่างเปล่า
  function setTag(id, text) {
    var node = document.getElementById(id);
    if (!node) return;
    if (text) {
      node.textContent = text;
      node.classList.remove("is-hidden");
    } else {
      node.textContent = "";
      node.classList.add("is-hidden");
    }
  }

  function setDifficultyDots(id, level) {
    var container = document.getElementById(id);
    if (!container) return;
    clear(container);
    var lvl = Number(level) || 0;
    for (var i = 1; i <= 3; i++) {
      container.appendChild(el("span", i <= lvl ? "dot dot-filled" : "dot"));
    }
  }

  function initLearn() {
    var bodyEl = document.getElementById("learnBody");
    var stateEl = document.getElementById("learnStateBox");
    var cardEl = document.getElementById("learnCard");
    if (!bodyEl || !stateEl || !cardEl) return;

    function showState(box) {
      bodyEl.classList.add("is-hidden");
      setText("learnChapterTitle", "Learn Mode");
      setText("learnProgressSub", "");
      clear(stateEl);
      stateEl.appendChild(box);
      stateEl.classList.remove("is-hidden");
    }

    if (!DATA) {
      showState(dataErrorBox());
      return;
    }

    var chapterId = new URLSearchParams(location.search).get("chapter");

    if (!chapterId) {
      showState(stateBox(
        "🔎",
        "ไม่ได้ระบุบทเรียน",
        "กรุณาเลือกบทจากหน้าบทเรียนก่อนเริ่มเรียน",
        "กลับไปหน้าบทเรียน",
        "chapters.html"
      ));
      return;
    }

    var chapter = DATA.getChapterById(chapterId);
    if (!chapter) {
      showState(stateBox(
        "🔎",
        "ไม่พบบทเรียนนี้",
        "ไม่พบบทเรียนรหัส \"" + chapterId + "\" อาจถูกลบหรือลิงก์ไม่ถูกต้อง",
        "กลับไปหน้าบทเรียน",
        "chapters.html"
      ));
      return;
    }

    var vocabList = DATA.getVocabularyByChapter(chapter.id);
    if (!vocabList || vocabList.length === 0) {
      showState(stateBox(
        "📝",
        "บทนี้ยังไม่มีคำศัพท์",
        "เมื่อเพิ่มคำศัพท์ให้บทนี้แล้ว จะสามารถเริ่มเรียนได้ที่นี่",
        "กลับไปหน้ารายละเอียดบท",
        "chapter-detail.html?id=" + encodeURIComponent(chapter.id)
      ));
      return;
    }

    var titleEl = document.getElementById("learnChapterTitle");
    var subEl = document.getElementById("learnProgressSub");
    var progressFillEl = document.getElementById("learnProgressFill");
    var currentIndex = 0;

    // ปุ่ม ← ในหัวหน้า: กลับไปหน้ารายละเอียดบทของ Chapter นี้ (Session เป็น state ในหน้านี้เท่านั้น
    // การออก/เข้าใหม่จึงเริ่ม Session ใหม่จากคำแรกเสมอ ไม่มีสถานะค้างที่ทำให้พัง)
    var backBtn = document.getElementById("learnBackBtn");
    if (backBtn) {
      backBtn.setAttribute("aria-label", "ย้อนกลับไปหน้ารายละเอียดบท");
      backBtn.onclick = function () {
        go("chapter-detail.html?id=" + encodeURIComponent(chapter.id));
      };
    }

    function renderCurrent() {
      var v = vocabList[currentIndex];

      // ไม่พบ Vocabulary ของ index นี้ (กันหน้าเว็บพัง แม้ไม่ควรเกิดขึ้นจริง)
      if (!v) {
        showState(stateBox(
          "⚠️",
          "ไม่พบคำศัพท์",
          "เกิดข้อผิดพลาดในการโหลดคำศัพท์คำนี้ กรุณากลับไปหน้าบทเรียน",
          "กลับไปหน้าบทเรียน",
          "chapters.html"
        ));
        return;
      }

      cardEl.classList.remove("is-revealed");

      if (titleEl) titleEl.textContent = chapter.title;
      if (subEl) subEl.textContent = "คำที่ " + (currentIndex + 1) + " / " + vocabList.length;
      if (progressFillEl) {
        progressFillEl.style.width = Math.round(((currentIndex + 1) / vocabList.length) * 100) + "%";
      }
      document.title = chapter.title + " — Learn Mode — จำศัพท์จีน";

      setTag("learnTag", v.category);
      setDifficultyDots("learnDifficulty", v.difficulty);
      setText("learnHanziFront", v.hanzi);
      setText("learnPinyinFront", v.pinyin);
      setText("learnHanziBack", v.hanzi);
      setText("learnPinyinBack", v.pinyin);
      setText("learnMeaning", v.meaning_th);
      setText("learnExampleHanzi", v.example);
      setText("learnExampleTh", v.example_th);
      setText("learnTip", v.memory_tip);
    }

    // TASK 5.1: Learning Session — ไล่ทีละคำตามลำดับ ไม่วนรอบ; หลังคำสุดท้าย → Session Complete
    // (ยังไม่บันทึกผลจำได้/ยังไม่ได้ — ทั้งสองปุ่มไปคำถัดไป)
    function goToNext() {
      if (currentIndex + 1 >= vocabList.length) {
        showComplete();
        return;
      }
      currentIndex++;
      renderCurrent();
    }

    function showComplete() {
      var box = el("section", "card state-box");
      box.appendChild(el("div", "state-icon", "🎉"));
      box.appendChild(el("h2", "state-title", "เรียนครบแล้ว!"));
      box.appendChild(el("p", "state-text", "วันนี้เรียน " + vocabList.length + " คำ"));

      var actions = el("div", "state-actions");
      var backBtn2 = el("button", "btn btn-secondary", "กลับบท");
      backBtn2.type = "button";
      backBtn2.addEventListener("click", function () {
        go("chapter-detail.html?id=" + encodeURIComponent(chapter.id));
      });
      var again = el("button", "btn btn-primary", "เรียนอีกครั้ง");
      again.type = "button";
      again.addEventListener("click", function () {
        currentIndex = 0;
        stateEl.classList.add("is-hidden");
        clear(stateEl);
        bodyEl.classList.remove("is-hidden");
        renderCurrent();
      });
      actions.appendChild(backBtn2);
      actions.appendChild(again);
      box.appendChild(actions);

      bodyEl.classList.add("is-hidden");
      if (titleEl) titleEl.textContent = chapter.title;
      if (subEl) subEl.textContent = "จบ Session";
      clear(stateEl);
      stateEl.appendChild(box);
      stateEl.classList.remove("is-hidden");
    }

    var btnYes = document.getElementById("learnBtnYes");
    var btnNo = document.getElementById("learnBtnNo");
    if (btnYes) btnYes.addEventListener("click", goToNext);
    if (btnNo) btnNo.addEventListener("click", goToNext);

    renderCurrent();
  }

  /* ============================================================
     หน้า Quick Review (quick-review.html)
     TASK 4.4: เชื่อม Quick Review กับ VOCAB_DATA
     - ไม่ระบุ ?chapter= → ใช้คำศัพท์จากข้อมูลกลางทั้งหมด (getAllVocabulary)
       จำกัดไม่เกิน REVIEW_LIMIT คำ (Prototype ยังไม่มี SRS เลือกคำที่ถึงเวลาทบทวน)
     - ระบุ ?chapter=<id> → ทบทวนเฉพาะคำใน Chapter นั้น (getVocabularyByChapter)
     ============================================================ */
  var REVIEW_LIMIT = 12;

  function initQuickReview() {
    var bodyEl = document.getElementById("reviewBody");
    var stateEl = document.getElementById("reviewStateBox");
    var cardEl = document.getElementById("reviewCard");
    if (!bodyEl || !stateEl || !cardEl) return;

    function showState(box) {
      bodyEl.classList.add("is-hidden");
      setText("reviewProgressSub", "");
      clear(stateEl);
      stateEl.appendChild(box);
      stateEl.classList.remove("is-hidden");
    }

    if (!DATA) {
      showState(dataErrorBox());
      return;
    }

    var chapterId = new URLSearchParams(location.search).get("chapter");
    var reviewList;

    if (chapterId) {
      var chapter = DATA.getChapterById(chapterId);
      if (!chapter) {
        showState(stateBox(
          "🔎",
          "ไม่พบบทเรียนนี้",
          "ไม่พบบทเรียนรหัส \"" + chapterId + "\" อาจถูกลบหรือลิงก์ไม่ถูกต้อง",
          "กลับไปหน้าบทเรียน",
          "chapters.html"
        ));
        return;
      }
      reviewList = DATA.getVocabularyByChapter(chapter.id);
    } else {
      // ข้ามคำที่ chapterId ไม่ตรงกับบทใด ๆ (ข้อมูลกำพร้า) เพื่อให้สอดคล้องกับ Chapters/Learn
      reviewList = DATA.getAllVocabulary().filter(function (v) {
        return DATA.getChapterById(v.chapterId);
      });
    }

    reviewList = (reviewList || []).slice(0, REVIEW_LIMIT);

    if (reviewList.length === 0) {
      showState(stateBox(
        "📭",
        "ยังไม่มีคำศัพท์ให้ทบทวน",
        "เมื่อมีคำศัพท์ในบทเรียนแล้ว จะสามารถทบทวนได้ที่นี่",
        "ไปหน้าบทเรียน",
        "chapters.html"
      ));
      return;
    }

    var subEl = document.getElementById("reviewProgressSub");
    var progressFillEl = document.getElementById("reviewProgressFill");
    var currentIndex = 0;

    function renderCurrent() {
      var v = reviewList[currentIndex];

      if (!v) {
        showState(stateBox(
          "⚠️",
          "ไม่พบคำศัพท์",
          "เกิดข้อผิดพลาดในการโหลดคำศัพท์คำนี้ กรุณากลับหน้าแรก",
          "กลับหน้าแรก",
          "index.html"
        ));
        return;
      }

      cardEl.classList.remove("is-revealed");

      if (subEl) subEl.textContent = (currentIndex + 1) + " / " + reviewList.length + " คำ";
      if (progressFillEl) {
        progressFillEl.style.width = Math.round(((currentIndex + 1) / reviewList.length) * 100) + "%";
      }

      setTag("reviewTag", v.category);
      setDifficultyDots("reviewDifficulty", v.difficulty);
      setText("reviewHanziFront", v.hanzi);
      setText("reviewPinyinFront", v.pinyin);
      setText("reviewHanziBack", v.hanzi);
      setText("reviewPinyinBack", v.pinyin);
      setText("reviewMeaning", v.meaning_th);
      setText("reviewExampleHanzi", v.example);
      setText("reviewExampleTh", v.example_th);
      setText("reviewTip", v.memory_tip);
    }

    // Prototype: วนรอบในรายการทบทวน (ยังไม่บันทึกผลจำได้/ยังไม่ได้ ลง Progress)
    function step(delta) {
      var n = reviewList.length;
      currentIndex = (currentIndex + delta + n) % n;
      renderCurrent();
    }

    function bind(id, delta) {
      var btn = document.getElementById(id);
      if (btn) btn.addEventListener("click", function () { step(delta); });
    }
    bind("reviewBtnYes", 1);
    bind("reviewBtnNo", 1);
    bind("reviewNextBtn", 1);
    bind("reviewPrevBtn", -1);

    renderCurrent();
  }

  /* ---------- Router: ทำงานตามหน้าที่เปิดอยู่ ---------- */
  function init() {
    var page = document.querySelector("main.page");
    if (!page) return;
    if (page.id === "page-chapters") initChapters();
    else if (page.id === "page-chapter-detail") initChapterDetail();
    else if (page.id === "page-learn") initLearn();
    else if (page.id === "page-quick-review") initQuickReview();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
