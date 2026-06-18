import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function BookmarkForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formattedUrl = url.startsWith("http") ? url : `https://${url}`;

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { error } = await supabase.from("bookmarks").insert([
      {
        title,
        url: formattedUrl, 
        description,
        user_id: user.id,
      },
    ]);

    if (error) {
      alert("저장 실패: " + error.message);
      console.log(error);
    } else {
      onAdd();
      setTitle("");
      setUrl("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>북마크 추가</h2>

      <input
        required // 빈 값 방지
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        required // 빈 값 방지
        placeholder="URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <input
        placeholder="설명"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit">추가</button>
    </form>
  );
}