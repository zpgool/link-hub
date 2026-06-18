import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function BookmarkForm({ onAdd }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data, error } = await supabase.from("bookmarks").insert([
      {
        title,
        url,
        description,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.log(error);
    } else {
      console.log("추가 성공:", data);

      // 부모(Home) 새로고침용
      onAdd();

      // 입력 초기화
      setTitle("");
      setUrl("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>북마크 추가</h2>

      <input
        placeholder="제목"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
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