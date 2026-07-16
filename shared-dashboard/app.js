import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Fill these from Supabase Project Settings -> API
const SUPABASE_URL = "https://ehbgfqkwxhyddntchayw.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_Ek7A_NMS5P4ViBs5708tfw_isbPzKGe";

const CATEGORIES = [
  { value: "interaction", label: "Interaction" },
  { value: "ai_software", label: "AI Software" },
  { value: "ai_hardware", label: "AI Hardware" },
  { value: "ecosystem", label: "Ecosystem" },
  { value: "ai_capability", label: "AI Capability" },
  { value: "industry_events", label: "Industry Events" },
];

const editorNameInput = document.getElementById("editorName");
const filterCategorySelect = document.getElementById("filterCategory");
const newMonthInput = document.getElementById("newMonthInput");
const addMonthBtn = document.getElementById("addMonthBtn");
const toggleEditBtn = document.getElementById("toggleEditBtn");
const editControls = document.getElementById("editControls");
const editTitle = document.getElementById("editTitle");
const statusText = document.getElementById("statusText");
const board = document.getElementById("board");

let supabase = null;
let topics = [];
let isEditMode = false;

function formatDateOnly(ts) {
  return new Date(ts).toISOString().slice(0, 10);
}

function setStatus(message) {
  statusText.textContent = message;
}

function requireClient() {
  if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
    setStatus("Please set SUPABASE_URL and SUPABASE_ANON_KEY in app.js");
    return false;
  }
  return true;
}

function monthGroups(rows) {
  const map = new Map();
  for (const row of rows) {
    if (!map.has(row.month_order)) {
      map.set(row.month_order, {
        month_label: row.month_label,
        month_order: row.month_order,
        items: [],
      });
    }
    map.get(row.month_order).items.push(row);
  }
  return [...map.values()].sort((a, b) => a.month_order - b.month_order);
}

function categoryOptions(selected) {
  return CATEGORIES.map(
    (c) => `<option value="${c.value}" ${c.value === selected ? "selected" : ""}>${c.label}</option>`
  ).join("");
}

function parseMonthOrder(label) {
  const match = label.match(/([A-Za-z]{3})\s+(\d{4})/);
  if (!match) return null;
  const monthMap = {
    Jan: 1,
    Feb: 2,
    Mar: 3,
    Apr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Aug: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dec: 12,
  };
  const mm = monthMap[match[1]];
  const yyyy = Number(match[2]);
  if (!mm || !yyyy) return null;
  return yyyy * 100 + mm;
}

async function loadTopics() {
  const { data, error } = await supabase
    .from("monthly_topics")
    .select("*")
    .order("month_order", { ascending: true })
    .order("updated_at", { ascending: true });

  if (error) {
    setStatus(`Load failed: ${error.message}`);
    return;
  }

  topics = data || [];
  render();
  setStatus(`Synced ${formatDateOnly(new Date())}`);
}

function render() {
  const filter = filterCategorySelect.value;
  const visible = filter === "all" ? topics : topics.filter((t) => t.category === filter);
  const groups = monthGroups(visible);

  board.innerHTML = groups
    .map(
      (group) => `
      <article class="month">
        <div class="month-head">
          <h3>${group.month_label}</h3>
          <div class="month-tools">
            ${isEditMode ? `<button class="btn ghost" data-action="add-topic-month" data-month-label="${escapeHtml(group.month_label)}" data-month-order="${group.month_order}">Add Topic</button>` : ""}
          </div>
        </div>
        ${group.items
          .map(
            (item) => `
          <section class="topic" data-id="${item.id}" data-month-label="${escapeHtml(item.month_label)}" data-month-order="${item.month_order}">
            ${
              isEditMode
                ? `
              <input class="edit-topic-title" data-field="topic_title" value="${escapeHtml(item.topic_title)}" />
              <div class="edit-secondary">
                <select data-field="category">${categoryOptions(item.category)}</select>
                <button class="btn save" data-action="save">Save</button>
              </div>
              <input data-field="notes" value="${escapeHtml(item.notes || "")}" placeholder="Notes" />
            `
                : `
              <div class="topic-title">${escapeHtml(item.topic_title)}</div>
              <div>${CATEGORIES.find((c) => c.value === item.category)?.label || item.category}</div>
            `
            }
            <div class="${isEditMode ? "meta-row" : "row"}">
              <span class="hint">${escapeHtml(item.updated_by || "unknown")} · ${formatDateOnly(item.updated_at)}</span>
              ${isEditMode ? `<button class="btn del" data-action="delete">Delete</button>` : `<span></span>`}
            </div>
          </section>
        `
          )
          .join("")}
      </article>
    `
    )
    .join("");
}

function escapeHtml(v) {
  return String(v)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

async function saveTopic(topicId, sectionEl) {
  const editor = editorNameInput.value.trim() || "teammate";
  const topicTitle = sectionEl.querySelector('[data-field="topic_title"]').value.trim();
  const category = sectionEl.querySelector('[data-field="category"]').value;
  const monthLabel = sectionEl.dataset.monthLabel;
  const monthOrder = Number(sectionEl.dataset.monthOrder);
  const notes = sectionEl.querySelector('[data-field="notes"]').value.trim();

  if (!topicTitle) {
    setStatus("Topic title is required");
    return;
  }

  if (!monthLabel || !monthOrder) {
    setStatus("Missing month info");
    return;
  }

  setStatus("Saving...");
  const { error } = await supabase
    .from("monthly_topics")
    .update({
      topic_title: topicTitle,
      category,
      month_label: monthLabel,
      month_order: monthOrder,
      notes,
      updated_by: editor,
    })
    .eq("id", topicId);

  if (error) {
    setStatus(`Save failed: ${error.message}`);
    return;
  }
  setStatus("Saved");
}

async function deleteTopic(topicId) {
  setStatus("Deleting...");
  const { error } = await supabase.from("monthly_topics").delete().eq("id", topicId);
  if (error) {
    setStatus(`Delete failed: ${error.message}`);
    return;
  }
  setStatus("Deleted");
}

async function addTopicToMonth(monthLabel, monthOrder) {
  const editor = editorNameInput.value.trim() || "teammate";
  setStatus("Adding topic...");
  const { error } = await supabase.from("monthly_topics").insert({
    month_label: monthLabel,
    month_order: monthOrder,
    topic_title: "New topic",
    category: "interaction",
    notes: "",
    updated_by: editor,
  });
  if (error) {
    setStatus(`Add failed: ${error.message}`);
    return;
  }
  setStatus("Topic added");
}

async function addMonth() {
  const editor = editorNameInput.value.trim() || "teammate";
  const monthLabel = newMonthInput.value.trim();
  const monthOrder = parseMonthOrder(monthLabel);
  if (!monthOrder) {
    setStatus("Month format must be like: Jul 2026");
    return;
  }
  setStatus("Adding month...");
  const { error } = await supabase.from("monthly_topics").insert({
    month_label: monthLabel,
    month_order: monthOrder,
    topic_title: "New topic",
    category: "interaction",
    notes: "",
    updated_by: editor,
  });
  if (error) {
    setStatus(`Add month failed: ${error.message}`);
    return;
  }
  newMonthInput.value = "";
  setStatus("Month added");
}

function bindEvents() {
  filterCategorySelect.addEventListener("change", render);

  addMonthBtn.addEventListener("click", async () => {
    await addMonth();
  });

  toggleEditBtn.addEventListener("click", () => {
    isEditMode = !isEditMode;
    toggleEditBtn.textContent = isEditMode ? "Switch to View Mode" : "Switch to Edit Mode";
    editControls.classList.toggle("hidden", !isEditMode);
    editTitle.classList.toggle("hidden", !isEditMode);
    render();
  });

  board.addEventListener("click", async (e) => {
    const btn = e.target.closest("button[data-action]");
    if (!btn) return;
    const action = btn.dataset.action;
    if (action === "add-topic-month") {
      const monthLabel = btn.dataset.monthLabel;
      const monthOrder = Number(btn.dataset.monthOrder);
      if (!monthLabel || !monthOrder) return;
      await addTopicToMonth(monthLabel, monthOrder);
      return;
    }

    const section = e.target.closest(".topic");
    if (!section) return;
    const topicId = section.dataset.id;
    if (!topicId) return;

    if (action === "save") await saveTopic(topicId, section);
    if (action === "delete") await deleteTopic(topicId);
  });
}

async function init() {
  if (!requireClient()) return;
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  bindEvents();
  await loadTopics();

  supabase
    .channel("monthly-topics-realtime")
    .on(
      "postgres_changes",
      { event: "*", schema: "public", table: "monthly_topics" },
      () => loadTopics()
    )
    .subscribe((status) => {
      if (status === "SUBSCRIBED") setStatus("Live sync connected");
    });
}

init();
