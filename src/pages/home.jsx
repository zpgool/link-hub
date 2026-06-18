import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import BookmarkForm from "../components/BookmarkForm";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [bookmarks, setBookmarks] = useState([]);

  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const fetchBookmarks = async () => {
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;

    if (!user) return;

    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id);

    setBookmarks(data);
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const [editId, setEditId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editUrl, setEditUrl] = useState("");
  const [editDescription, setEditDescription] = useState("");

  const startEdit = (item) => {
    setEditId(item.id);
    setEditTitle(item.title);
    setEditUrl(item.url);
    setEditDescription(item.description);
  };

  const handleUpdate = async () => {
    const { error } = await supabase
      .from("bookmarks")
      .update({
        title: editTitle,
        url: editUrl.startsWith("http") ? editUrl : `https://${editUrl}`,
        description: editDescription,
      })
      .eq("id", editId);

    if (error) {
      console.log(error);
      return;
    }

    setEditId(null);
    fetchBookmarks();
  };

  return (
    <div>
      <button onClick={handleLogout}>로그아웃</button>

      <h1>Home</h1>
      <BookmarkForm onAdd={fetchBookmarks} />

      {bookmarks.length === 0 ? (
        <p>북마크 없음</p>
      ) : (
        bookmarks.map((item) => (
          <div key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <a href={`https://${item.url}`} target="_blank" rel="noreferrer">
              링크
            </a>
            <button onClick={() => startEdit(item)}>수정</button>
          </div>
        ))
      )}
      {editId && (
        <div>
          <h2>수정하기</h2>

          <input
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
          />

          <input value={editUrl} onChange={(e) => setEditUrl(e.target.value)} />

          <input
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />

          <button onClick={handleUpdate}>수정 완료</button>
        </div>
      )}
    </div>
  );
}
