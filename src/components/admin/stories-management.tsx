"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  Upload,
  Languages,
  GripVertical,
  Image as ImageIcon,
  Archive,
  EyeOff,
  Eye,
  Loader2,
  X,
} from "lucide-react";
import { useLanguage, useT } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  PERSPECTIVES,
  STORY_STATUSES,
  type StoryPerspective,
  type StoryRecord,
  type StoryStatus,
} from "@/lib/stories";
import type { Localized } from "@/lib/data";

// Existing image assets available in /public/images (for the "library" picker).
const IMAGE_LIBRARY = [
  "/images/candle-hope.png",
  "/images/children-hands.png",
  "/images/globe-cries.png",
  "/images/house-real-facade.png",
  "/images/house-real-street.png",
  "/images/offering-hands.png",
  "/images/open-bible.png",
  "/images/orphanage-bantul.png",
  "/images/orphanage-surabaya.png",
  "/images/scroll-bg.png",
  "/images/scroll-bg-real.png",
];

const ORPHANAGES = ["", "bantul", "semarang", "surabaya"];

// ---- editor form state ----
type EditorState = {
  id: string | null;
  titleEn: string;
  titleId: string;
  subtitleEn: string;
  subtitleId: string;
  body: Localized[];
  captionEn: string;
  captionId: string;
  tagEn: string;
  tagId: string;
  orphanageId: string;
  image: string;
  perspective: StoryPerspective;
  originalLang: "en" | "id";
  status: StoryStatus;
  showInStories: boolean;
  showInGallery: boolean;
  highlight: boolean;
  sortIndex: number;
};

function emptyEditor(): EditorState {
  return {
    id: null,
    titleEn: "",
    titleId: "",
    subtitleEn: "",
    subtitleId: "",
    body: [{ en: "", id: "" }],
    captionEn: "",
    captionId: "",
    tagEn: "",
    tagId: "",
    orphanageId: "",
    image: "",
    perspective: "Field",
    originalLang: "en",
    status: "published",
    showInStories: true,
    showInGallery: false,
    highlight: false,
    sortIndex: 0,
  };
}

function recordToEditor(s: StoryRecord): EditorState {
  return {
    id: s.id,
    titleEn: s.title.en,
    titleId: s.title.id,
    subtitleEn: s.subtitle.en,
    subtitleId: s.subtitle.id,
    body: s.body.length ? s.body : [{ en: "", id: "" }],
    captionEn: s.caption.en,
    captionId: s.caption.id,
    tagEn: s.tag.en,
    tagId: s.tag.id,
    orphanageId: s.orphanageId,
    image: s.image,
    perspective: s.perspective,
    originalLang: s.originalLang,
    status: s.status,
    showInStories: s.showInStories,
    showInGallery: s.showInGallery,
    highlight: s.highlight,
    sortIndex: s.sortIndex,
  };
}

// ============================================================
// Main management card
// ============================================================
export function StoriesManagementCard() {
  const t = useT();
  const lang = useLanguage((s) => s.lang);
  const { toast } = useToast();

  const [stories, setStories] = useState<StoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | StoryStatus>("all");
  const [editorOpen, setEditorOpen] = useState(false);
  const [editor, setEditor] = useState<EditorState>(emptyEditor());

  // Keep the latest `t` in a ref so `load` can stay referentially stable.
  // (useT() returns a new function each render, so depending on it in
  // useCallback would cause an infinite re-fetch loop.)
  const tRef = useRef(t);
  tRef.current = t;
  // Track the currently in-flight request so stale responses are ignored.
  const loadIdRef = useRef(0);

  const load = useCallback(async () => {
    const myId = ++loadIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/stories?status=all", { cache: "no-store" });
      if (!res.ok) throw new Error("fetch failed");
      const data = await res.json();
      // Ignore this response if a newer load() was started after us.
      if (myId !== loadIdRef.current) return;
      setStories(data.stories ?? []);
    } catch {
      if (myId !== loadIdRef.current) return;
      setError(tRef.current("dash.storiesLoadFail"));
    } finally {
      if (myId === loadIdRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return stories.filter((s) => {
      if (statusFilter !== "all" && s.status !== statusFilter) return false;
      if (!q) return true;
      return (
        s.title.en.toLowerCase().includes(q) ||
        s.title.id.toLowerCase().includes(q) ||
        s.subtitle.en.toLowerCase().includes(q) ||
        s.subtitle.id.toLowerCase().includes(q)
      );
    });
  }, [stories, query, statusFilter]);

  const openNew = () => {
    setEditor(emptyEditor());
    setEditorOpen(true);
  };
  const openEdit = (s: StoryRecord) => {
    setEditor(recordToEditor(s));
    setEditorOpen(true);
  };

  const handleDelete = async (s: StoryRecord) => {
    if (!confirm(t("dash.storiesDeleteConfirm"))) return;
    try {
      const res = await fetch(`/api/stories/${s.id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("delete failed");
      toast({ title: t("dash.storiesDeleted") });
      setStories((prev) => prev.filter((x) => x.id !== s.id));
    } catch {
      toast({ title: t("dash.storiesSaveFail"), variant: "destructive" });
    }
  };

  // Quick status change from the table row.
  const quickStatus = async (s: StoryRecord, status: StoryStatus) => {
    try {
      const res = await fetch(`/api/stories/${s.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "setStatus", status }),
      });
      if (!res.ok) throw new Error("update failed");
      const data = await res.json();
      setStories((prev) => prev.map((x) => (x.id === s.id ? data.story : x)));
    } catch {
      toast({ title: t("dash.storiesSaveFail"), variant: "destructive" });
    }
  };

  const handleSaved = (s: StoryRecord) => {
    setStories((prev) => {
      const idx = prev.findIndex((x) => x.id === s.id);
      if (idx === -1) return [...prev, s];
      const next = [...prev];
      next[idx] = s;
      return next;
    });
    setEditorOpen(false);
    toast({ title: t("dash.storiesSaved") });
  };

  return (
    <div className="rounded-xl border border-amber-900/20 bg-card/60 p-5 shadow-sm lg:col-span-2">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="font-blackletter text-2xl text-ember">
            {t("dash.storiesTitle")}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("dash.storiesDesc")}
          </p>
        </div>
        <Button onClick={openNew} className="gap-2">
          <Plus className="h-4 w-4" />
          {t("dash.storiesNew")}
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("dash.storiesSearchPh")}
          className="max-w-xs"
        />
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as "all" | StoryStatus)}>
          <SelectTrigger className="w-[160px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("dash.storiesAll")}</SelectItem>
            {STORY_STATUSES.map((st) => (
              <SelectItem key={st} value={st}>
                {t(`dash.storiesStatus${st[0].toUpperCase()}${st.slice(1)}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length}/{stories.length}
        </span>
      </div>

      {/* List */}
      {loading ? (
        <div className="flex items-center justify-center py-10 text-muted-foreground">
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        </div>
      ) : error ? (
        <div className="py-8 text-center text-sm text-destructive">{error}</div>
      ) : filtered.length === 0 ? (
        <div className="py-8 text-center text-sm text-muted-foreground">
          {t("dash.storiesEmpty")}
        </div>
      ) : (
        <div className="max-h-[28rem] overflow-y-auto pr-1">
          <ul className="space-y-2">
            {filtered.map((s) => (
              <StoryRow
                key={s.id}
                story={s}
                lang={lang}
                t={t}
                onEdit={() => openEdit(s)}
                onDelete={() => handleDelete(s)}
                onStatus={(st) => quickStatus(s, st)}
              />
            ))}
          </ul>
        </div>
      )}

      {/* Editor */}
      <StoryEditor
        open={editorOpen}
        state={editor}
        onOpenChange={setEditorOpen}
        onSaved={handleSaved}
      />
    </div>
  );
}

// ============================================================
// Single story row
// ============================================================
function StoryRow({
  story,
  lang,
  t,
  onEdit,
  onDelete,
  onStatus,
}: {
  story: StoryRecord;
  lang: "en" | "id";
  t: (k: string) => string;
  onEdit: () => void;
  onDelete: () => void;
  onStatus: (s: StoryStatus) => void;
}) {
  const title = story.title[lang] || story.title.en || story.title.id || "—";
  const statusColor: Record<StoryStatus, string> = {
    published: "bg-emerald-100 text-emerald-800 border-emerald-300",
    archived: "bg-amber-100 text-amber-800 border-amber-300",
    hidden: "bg-stone-200 text-stone-600 border-stone-300",
  };
  const nextStatus: Record<StoryStatus, { label: string; icon: typeof Eye; value: StoryStatus }> = {
    published: { label: t("dash.storiesArchive"), icon: Archive, value: "archived" },
    archived: { label: t("dash.storiesPublish"), icon: Eye, value: "published" },
    hidden: { label: t("dash.storiesPublish"), icon: Eye, value: "published" },
  };
  const ns = nextStatus[story.status];
  const placement = []
    .concat(story.showInStories ? [t("dash.storiesPlaceStories")] : [])
    .concat(story.showInGallery ? [t("dash.storiesPlaceGallery")] : []);
  const placementLabel = placement.length ? placement.join(" · ") : t("dash.storiesPlaceNone");

  return (
    <li className="flex items-center gap-3 rounded-lg border border-amber-900/10 bg-background/60 p-2.5">
      <div className="h-12 w-12 shrink-0 overflow-hidden rounded-md border border-amber-900/20 bg-stone-100">
        {story.image ? (
           
          <img
            src={story.image}
            alt={title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-stone-400">
            <ImageIcon className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <p className="truncate font-medium text-sm">{title}</p>
          {story.highlight && (
            <Badge variant="outline" className="shrink-0 border-amber-400 bg-amber-50 text-amber-700 text-[10px]">
              ★
            </Badge>
          )}
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
          <span>{t(`stories.perspective.${story.perspective}`)}</span>
          <span>·</span>
          <span>{placementLabel}</span>
        </div>
      </div>

      <Badge
        variant="outline"
        className={cn("shrink-0 text-[10px]", statusColor[story.status])}
      >
        {t(`dash.storiesStatus${story.status[0].toUpperCase()}${story.status.slice(1)}`)}
      </Badge>

      <div className="flex shrink-0 items-center gap-1">
        <Button size="sm" variant="ghost" className="h-8 gap-1 px-2" onClick={onStatus.bind(null, ns.value)} title={ns.label}>
          <ns.icon className="h-4 w-4" />
        </Button>
        {story.status !== "hidden" && (
          <Button
            size="sm"
            variant="ghost"
            className="h-8 gap-1 px-2"
            onClick={() => onStatus("hidden")}
            title={t("dash.storiesHide")}
          >
            <EyeOff className="h-4 w-4" />
          </Button>
        )}
        <Button size="sm" variant="ghost" className="h-8 gap-1 px-2" onClick={onEdit} title={t("dash.storiesEdit")}>
          <Pencil className="h-4 w-4" />
        </Button>
        <Button size="sm" variant="ghost" className="h-8 gap-1 px-2 text-destructive" onClick={onDelete} title={t("dash.storiesDelete")}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </li>
  );
}

// ============================================================
// Story editor dialog
// ============================================================
function StoryEditor({
  open,
  state,
  onOpenChange,
  onSaved,
}: {
  open: boolean;
  state: EditorState;
  onOpenChange: (v: boolean) => void;
  onSaved: (s: StoryRecord) => void;
}) {
  const t = useT();
  const { toast } = useToast();
  const [form, setForm] = useState<EditorState>(state);
  const [saving, setSaving] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showLibrary, setShowLibrary] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  // Sync incoming state when the dialog opens.
  useEffect(() => {
    if (open) setForm(state);
  }, [open, state]);

  const set = <K extends keyof EditorState>(k: K, v: EditorState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  // ---- body paragraph helpers ----
  const addParagraph = () =>
    setForm((f) => ({ ...f, body: [...f.body, { en: "", id: "" }] }));
  const removeParagraph = (i: number) =>
    setForm((f) => ({ ...f, body: f.body.filter((_, idx) => idx !== i) }));
  const setParagraph = (i: number, lang: "en" | "id", v: string) =>
    setForm((f) => ({
      ...f,
      body: f.body.map((p, idx) => (idx === i ? { ...p, [lang]: v } : p)),
    }));

  // ---- image upload ----
  const handleUpload = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "upload failed");
      set("image", data.url);
    } catch {
      toast({ title: t("dash.editorImageUploadFail"), variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  // ---- translate ----
  const handleTranslate = async () => {
    if (!form.id) return; // only existing stories can be translated
    const direction = form.originalLang === "en" ? "en-to-id" : "id-to-en";
    setTranslating(true);
    try {
      const res = await fetch(`/api/stories/${form.id}/translate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ direction }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "translate failed");
      // Merge translated fields into the editor form.
      const s = data.story as StoryRecord;
      setForm((f) => ({
        ...f,
        titleId: s.title.id,
        titleEn: s.title.en,
        subtitleId: s.subtitle.id,
        subtitleEn: s.subtitle.en,
        captionId: s.caption.id,
        captionEn: s.caption.en,
        tagId: s.tag.id,
        tagEn: s.tag.en,
        body: s.body.length ? s.body : f.body,
      }));
      toast({ title: t("dash.editorTranslated") });
    } catch {
      toast({ title: t("dash.editorTranslateFail"), variant: "destructive" });
    } finally {
      setTranslating(false);
    }
  };

  // ---- save ----
  const handleSave = async () => {
    setSaving(true);
    try {
      const payload = { ...form };
      const isEdit = Boolean(form.id);
      const url = isEdit ? `/api/stories/${form.id}` : "/api/stories";
      const method = isEdit ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "save failed");
      onSaved(data.story as StoryRecord);
    } catch {
      toast({ title: t("dash.storiesSaveFail"), variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const targetLangLabel =
    form.originalLang === "en"
      ? t("dash.editorOriginalLangId")
      : t("dash.editorOriginalLangEn");
  const translateLabel = t("dash.editorTranslate").replace("{lang}", targetLangLabel);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] w-[95vw] max-w-3xl overflow-hidden p-0 sm:max-w-3xl">
        <DialogHeader className="border-b border-amber-900/15 px-6 py-4">
          <DialogTitle className="font-blackletter text-2xl text-ember">
            {form.id ? t("dash.editorTitle") : t("dash.editorNew")}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {t("dash.storiesDesc")}
          </DialogDescription>
        </DialogHeader>

        <div className="max-h-[calc(92vh-9rem)] overflow-y-auto px-6 py-5">
          {/* Image */}
          <FieldGroup label={t("dash.editorImage")}>
            <div className="flex flex-wrap items-start gap-4">
              <div className="h-24 w-32 shrink-0 overflow-hidden rounded-md border border-amber-900/20 bg-stone-100">
                {form.image ? (
                   
                  <img src={form.image} alt="" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-stone-400">
                    <ImageIcon className="h-5 w-5" />
                    <span className="text-[10px]">{t("dash.editorImageNone")}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <Input
                  value={form.image}
                  onChange={(e) => set("image", e.target.value)}
                  placeholder="/images/candle-hope.png"
                  className="w-64"
                />
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => setShowLibrary((v) => !v)}
                    className="gap-1"
                  >
                    <ImageIcon className="h-3.5 w-3.5" />
                    {t("dash.editorImagePick")}
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => fileRef.current?.click()}
                    disabled={uploading}
                    className="gap-1"
                  >
                    {uploading ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Upload className="h-3.5 w-3.5" />
                    )}
                    {uploading ? t("dash.editorImageUploading") : t("dash.editorImageUpload")}
                  </Button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/gif"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleUpload(f);
                      e.target.value = "";
                    }}
                  />
                </div>
                {showLibrary && (
                  <div className="grid w-64 grid-cols-4 gap-1.5 rounded-md border border-amber-900/15 bg-background p-2">
                    {IMAGE_LIBRARY.map((src) => (
                      <button
                        key={src}
                        type="button"
                        onClick={() => {
                          set("image", src);
                          setShowLibrary(false);
                        }}
                        className={cn(
                          "h-10 w-10 overflow-hidden rounded border-2 transition",
                          form.image === src
                            ? "border-amber-600"
                            : "border-transparent hover:border-amber-300",
                        )}
                      >
                        { }
                        <img src={src} alt="" className="h-full w-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </FieldGroup>

          {/* Classification row */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <FieldGroup label={t("dash.editorOriginalLang")}>
              <Select
                value={form.originalLang}
                onValueChange={(v) => set("originalLang", v as "en" | "id")}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">{t("dash.editorOriginalLangEn")}</SelectItem>
                  <SelectItem value="id">{t("dash.editorOriginalLangId")}</SelectItem>
                </SelectContent>
              </Select>
            </FieldGroup>
            <FieldGroup label={t("dash.editorPerspective")}>
              <Select
                value={form.perspective}
                onValueChange={(v) => set("perspective", v as StoryPerspective)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PERSPECTIVES.map((p) => (
                    <SelectItem key={p} value={p}>
                      {t(`stories.perspective.${p}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldGroup>
            <FieldGroup label={t("dash.editorStatus")}>
              <Select
                value={form.status}
                onValueChange={(v) => set("status", v as StoryStatus)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STORY_STATUSES.map((st) => (
                    <SelectItem key={st} value={st}>
                      {t(`dash.storiesStatus${st[0].toUpperCase()}${st.slice(1)}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FieldGroup>
          </div>

          {/* Translate button */}
          {form.id && (
            <div className="mb-4">
              <Button
                type="button"
                variant="secondary"
                onClick={handleTranslate}
                disabled={translating}
                className="gap-2"
              >
                {translating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Languages className="h-4 w-4" />
                )}
                {translating ? t("dash.editorTranslating") : translateLabel}
              </Button>
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                {form.originalLang === "en"
                  ? t("dash.editorOriginalLangEn") + " → " + t("dash.editorOriginalLangId")
                  : t("dash.editorOriginalLangId") + " → " + t("dash.editorOriginalLangEn")}
              </p>
            </div>
          )}

          {/* Titles */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldGroup label={t("dash.editorTitleEn")}>
              <Input
                value={form.titleEn}
                onChange={(e) => set("titleEn", e.target.value)}
              />
            </FieldGroup>
            <FieldGroup label={t("dash.editorTitleId")}>
              <Input
                value={form.titleId}
                onChange={(e) => set("titleId", e.target.value)}
              />
            </FieldGroup>
          </div>

          {/* Subtitles */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FieldGroup label={t("dash.editorSubtitleEn")}>
              <Textarea
                value={form.subtitleEn}
                onChange={(e) => set("subtitleEn", e.target.value)}
                rows={2}
              />
            </FieldGroup>
            <FieldGroup label={t("dash.editorSubtitleId")}>
              <Textarea
                value={form.subtitleId}
                onChange={(e) => set("subtitleId", e.target.value)}
                rows={2}
              />
            </FieldGroup>
          </div>

          {/* Body paragraphs */}
          <FieldGroup label={t("dash.editorBody")}>
            <div className="space-y-3">
              {form.body.map((p, i) => (
                <div
                  key={i}
                  className="rounded-md border border-amber-900/15 bg-background/60 p-3"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
                      <GripVertical className="h-3 w-3" />#{i + 1}
                    </span>
                    {form.body.length > 1 && (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="h-6 gap-1 px-2 text-[11px] text-destructive"
                        onClick={() => removeParagraph(i)}
                      >
                        <X className="h-3 w-3" />
                        {t("dash.editorRemoveParagraph")}
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <div>
                      <Label className="mb-1 block text-[10px] uppercase text-muted-foreground">
                        {t("dash.editorBodyEn")}
                      </Label>
                      <Textarea
                        value={p.en}
                        onChange={(e) => setParagraph(i, "en", e.target.value)}
                        rows={3}
                      />
                    </div>
                    <div>
                      <Label className="mb-1 block text-[10px] uppercase text-muted-foreground">
                        {t("dash.editorBodyId")}
                      </Label>
                      <Textarea
                        value={p.id}
                        onChange={(e) => setParagraph(i, "id", e.target.value)}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={addParagraph}
                className="gap-1"
              >
                <Plus className="h-3.5 w-3.5" />
                {t("dash.editorAddParagraph")}
              </Button>
            </div>
          </FieldGroup>

          {/* Placement toggles */}
          <FieldGroup label={t("dash.editorPlacement")}>
            <div className="flex flex-wrap gap-5">
              <ToggleRow
                label={t("dash.editorShowStories")}
                checked={form.showInStories}
                onChange={(v) => set("showInStories", v)}
              />
              <ToggleRow
                label={t("dash.editorShowGallery")}
                checked={form.showInGallery}
                onChange={(v) => set("showInGallery", v)}
              />
              <ToggleRow
                label={t("dash.editorHighlight")}
                checked={form.highlight}
                onChange={(v) => set("highlight", v)}
              />
            </div>
          </FieldGroup>

          {/* Gallery fields */}
          {form.showInGallery && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-2"
            >
              <FieldGroup label={t("dash.editorGallery")}>
                <div className="space-y-3">
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FieldGroup label={t("dash.editorCaptionEn")}>
                      <Textarea
                        value={form.captionEn}
                        onChange={(e) => set("captionEn", e.target.value)}
                        rows={2}
                      />
                    </FieldGroup>
                    <FieldGroup label={t("dash.editorCaptionId")}>
                      <Textarea
                        value={form.captionId}
                        onChange={(e) => set("captionId", e.target.value)}
                        rows={2}
                      />
                    </FieldGroup>
                  </div>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <FieldGroup label={t("dash.editorTagEn")}>
                      <Input
                        value={form.tagEn}
                        onChange={(e) => set("tagEn", e.target.value)}
                      />
                    </FieldGroup>
                    <FieldGroup label={t("dash.editorTagId")}>
                      <Input
                        value={form.tagId}
                        onChange={(e) => set("tagId", e.target.value)}
                      />
                    </FieldGroup>
                    <FieldGroup label={t("dash.editorOrphanage")}>
                      <Select
                        value={form.orphanageId || "_none"}
                        onValueChange={(v) =>
                          set("orphanageId", v === "_none" ? "" : v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="_none">—</SelectItem>
                          {ORPHANAGES.filter(Boolean).map((o) => (
                            <SelectItem key={o} value={o}>
                              {o}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FieldGroup>
                  </div>
                </div>
              </FieldGroup>
            </motion.div>
          )}
        </div>

        <DialogFooter className="border-t border-amber-900/15 px-6 py-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={saving}
          >
            {t("dash.editorCancel")}
          </Button>
          <Button onClick={handleSave} disabled={saving} className="gap-2">
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            {saving ? t("dash.editorSaving") : t("dash.editorSave")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ---- small field helpers ----
function FieldGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-4">
      <Label className="mb-1.5 block text-xs font-medium text-foreground/80">
        {label}
      </Label>
      {children}
    </div>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Switch checked={checked} onCheckedChange={onChange} />
      <span className="text-sm">{label}</span>
    </div>
  );
}
