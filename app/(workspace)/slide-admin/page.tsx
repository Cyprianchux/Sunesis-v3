"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { Button, Input, Panel, Toast } from "../../../components/ui";
import { WorkspaceGuard } from "../../../components/workspace-guard";
import { getCurrentUser, getSlides, getTopics, saveSlides, saveTopics } from "../../../lib/storage";
import type { Slide, Topic } from "../../../lib/types";
import { makeId } from "../../../lib/utils";

type NoticeType = "info" | "success" | "error";
type PendingDelete =
  { kind: "topic"; name: string } | { kind: "slide"; id: string; title: string } | null;

export default function AdminPage() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [topicName, setTopicName] = useState("");
  const [topic, setTopic] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState<"image" | "video">("image");
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState<NoticeType>("info");
  const [pendingDelete, setPendingDelete] = useState<PendingDelete>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTopics(getTopics());
    setSlides(getSlides());
  }, []);
  const showNotice = (message: string, type: NoticeType = "info") => {
    setNotice(message);
    setNoticeType(type);
  };
  const createTopic = () => {
    const name = topicName.trim();
    if (!name) return;
    if (topics.some((item) => item.name.toLowerCase() === name.toLowerCase()))
      return showNotice("That topic already exists.", "error");
    const next = [
      ...topics,
      { name, creator: getCurrentUser() || "learner", createdAt: new Date().toISOString() },
    ];
    setTopics(next);
    saveTopics(next);
    setTopicName("");
    showNotice("Topic created.", "success");
  };
  const addSlide = () => {
    if (!topic || !title.trim())
      return showNotice("Choose a topic and add a slide title.", "error");
    const descriptionValue = descriptionRef.current?.innerHTML || description;
    const media = mediaUrl.trim();
    const next = [
      ...slides,
      {
        id: makeId(),
        topic,
        title: title.trim(),
        description: descriptionValue,
        ...(media ? { mediaUrl: media, mediaType } : {}),
        creator: getCurrentUser() || "learner",
      },
    ];
    setSlides(next);
    saveSlides(next);
    setTitle("");
    setDescription("");
    setMediaUrl("");
    setMediaType("image");
    if (descriptionRef.current) descriptionRef.current.innerHTML = "";
    showNotice("Slide added.", "success");
  };
  const selectMedia = (file: File | undefined) => {
    if (!file) return;
    const type = file.type.startsWith("video/")
      ? "video"
      : file.type.startsWith("image/")
        ? "image"
        : null;
    if (!type) return showNotice("Choose an image or video file.", "error");
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setMediaUrl(reader.result);
        setMediaType(type);
      }
    };
    reader.onerror = () => showNotice("Unable to read that media file.", "error");
    reader.readAsDataURL(file);
  };
  const confirmDelete = () => {
    if (!pendingDelete) return;
    if (pendingDelete.kind === "topic") {
      const nextTopics = topics.filter((item) => item.name !== pendingDelete.name);
      const nextSlides = slides.filter((item) => item.topic !== pendingDelete.name);
      setTopics(nextTopics);
      setSlides(nextSlides);
      saveTopics(nextTopics);
      saveSlides(nextSlides);
      showNotice("Topic deleted.", "success");
    } else {
      const next = slides.filter((item) => item.id !== pendingDelete.id);
      setSlides(next);
      saveSlides(next);
      showNotice("Slide deleted.", "success");
    }
    setPendingDelete(null);
  };
  const handleDescriptionKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.ctrlKey || event.metaKey) && ["b", "i"].includes(event.key.toLowerCase())) {
      event.preventDefault();
      document.execCommand(event.key.toLowerCase() === "b" ? "bold" : "italic");
    }
  };
  const buttonClass = "text-xs font-bold text-red-600";

  return (
    <WorkspaceGuard>
      <div className="mx-auto max-w-7xl px-6 py-10">
        {notice && <Toast message={notice} type={noticeType} onDismiss={() => setNotice("")} />}
        <header className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[.15em] text-brick">Workspace setup</p>
          <h1 className="mt-2 text-4xl font-black text-maroon">Content Manager</h1>
          <p className="mt-2 text-muted">
            Create topics, compose slides, and organize your knowledge base.
          </p>
        </header>
        <div className="grid gap-6 lg:grid-cols-[360px_1fr]">
          <aside className="space-y-6">
            <Panel>
              <h2 className="text-lg font-bold text-maroon">▣ Create a new topic</h2>
              <Input
                className="mt-5"
                value={topicName}
                onChange={(e) => setTopicName(e.target.value)}
                placeholder="e.g. Pharmacology Basics"
              />
              <Button className="mt-3 w-full" onClick={createTopic}>
                + Create topic
              </Button>
            </Panel>
            <Panel>
              <h2 className="text-lg font-bold text-maroon">▦ Add a slide</h2>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="mt-5 w-full rounded-xl border border-line bg-[#fcf7f6] px-4 py-3 text-sm outline-none"
              >
                <option value="">Choose a topic</option>
                {topics.map((item) => (
                  <option key={item.name}>{item.name}</option>
                ))}
              </select>
              <Input
                className="mt-3"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Slide title"
              />
              <div
                ref={descriptionRef}
                contentEditable
                suppressContentEditableWarning
                role="textbox"
                aria-label="Slide description"
                aria-multiline="true"
                onKeyDown={handleDescriptionKeyDown}
                onInput={(e) => setDescription(e.currentTarget.innerHTML)}
                className="mt-3 min-h-28 w-full rounded-xl border border-line bg-[#fcf7f6] px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-tint"
                data-placeholder="Slide description (optional)"
              />
              <p className="mt-1 text-xs text-muted">
                Enter creates a new line · Ctrl/Cmd+B bold · Ctrl/Cmd+I italic · start a line with
                “- ” for a bullet.
              </p>
              <div className="mt-3">
                <label className="block text-sm font-semibold text-maroon" htmlFor="slide-media">
                  Picture or video (optional)
                </label>
                <input
                  id="slide-media"
                  type="file"
                  accept="image/*,video/*"
                  onChange={(e) => selectMedia(e.target.files?.[0])}
                  className="mt-2 w-full rounded-xl border border-line bg-[#fcf7f6] px-3 py-2 text-sm text-ink file:mr-3 file:rounded-lg file:border-0 file:bg-brick file:px-3 file:py-2 file:text-sm file:font-bold file:text-white"
                />
                {mediaUrl && (
                  <p className="mt-1 text-xs text-muted">
                    {mediaType === "video" ? "Video" : "Picture"} selected.
                  </p>
                )}
              </div>
              <Button className="mt-3 w-full" onClick={addSlide}>
                Add slide
              </Button>
            </Panel>
          </aside>
          <Panel>
            <h2 className="mb-5 text-lg font-bold text-maroon">▤ Existing topics & slides</h2>
            {topics.length === 0 ? (
              <p className="text-sm text-muted">No topics yet.</p>
            ) : (
              <div className="space-y-5">
                {topics.map((item) => (
                  <div key={item.name} className="rounded-xl border border-line p-4">
                    <div className="flex items-center justify-between gap-4">
                      <h3 className="font-bold text-maroon">{item.name}</h3>
                      <button
                        onClick={() => setPendingDelete({ kind: "topic", name: item.name })}
                        className={buttonClass}
                      >
                        Delete topic
                      </button>
                    </div>
                    {slides
                      .filter((slide) => slide.topic === item.name)
                      .map((slide) => (
                        <div
                          key={slide.id}
                          className="mt-3 flex items-start justify-between gap-3 rounded-lg bg-soft p-3"
                        >
                          <div>
                            <p className="font-semibold text-ink">{slide.title}</p>
                            <p className="mt-1 whitespace-pre-wrap text-xs text-muted">
                              {slide.description || "No description"}
                            </p>
                            {slide.mediaUrl && (
                              <p className="mt-1 text-xs text-muted">
                                {slide.mediaType === "video" ? "Video" : "Picture"} attached
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() =>
                              setPendingDelete({ kind: "slide", id: slide.id, title: slide.title })
                            }
                            className={buttonClass}
                          >
                            Delete slide
                          </button>
                        </div>
                      ))}
                  </div>
                ))}
              </div>
            )}
          </Panel>
        </div>
        {pendingDelete && (
          <div className="fixed inset-0 z-50 grid place-items-center bg-maroon/30 px-6">
            <div
              role="dialog"
              aria-modal="true"
              className="w-full max-w-md rounded-2xl border border-line bg-white p-6 shadow-2xl"
            >
              <h2 className="text-xl font-black text-maroon">Confirm deletion</h2>
              <p className="mt-3 text-sm text-muted">
                Delete{" "}
                {pendingDelete.kind === "topic"
                  ? `topic “${pendingDelete.name}” and all its slides`
                  : `slide “${pendingDelete.title}”`}
                ?
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setPendingDelete(null)}
                  className="rounded-xl border border-line px-4 py-3 text-sm font-bold text-maroon"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="rounded-xl bg-red-700 px-4 py-3 text-sm font-bold text-white"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </WorkspaceGuard>
  );
}
