import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import BookmarkForm from "../components/BookmarkForm";
import { useNavigate } from "react-router-dom";
import "../index.css"; // CSS 파일 import 경로를 맞춰주세요

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

  const handleDelete = async (id) => {
    if (!window.confirm("삭제할까요?")) return;

    await supabase.from("bookmarks").delete().eq("id", id);
    fetchBookmarks();
  };

  return (
    <>
      {/* HEADER */}
      <div className="header_bar">
        <h1>LinkHub</h1>
        <button className="logout-btn" onClick={handleLogout}>
          로그아웃
        </button>
      </div>

      <div className="main_box">
        <div className="card_box">
          <BookmarkForm onAdd={fetchBookmarks} />
        </div>

        <div className="memo_box">
          <ul id="message-list">
            {bookmarks.length === 0 ? (
              <p className="empty-msg">등록된 북마크가 없습니다.</p>
            ) : (
              bookmarks.map((item) => (
                <li key={item.id}>
                  <button
                    className="delete-btn"
                    title="삭제"
                    onClick={() => handleDelete(item.id)}
                  />

                  <div className="card_content">
                    <div className="text_area">
                      <strong>{item.title}</strong>
                      <span>{item.description}</span>
                    </div>

                    <div className="action_area">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="link-btn"
                      >
                        링크 이동
                      </a>
                      <button
                        className="edit-btn"
                        onClick={() => startEdit(item)}
                      >
                        수정
                      </button>
                    </div>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      </div>

      {editId && (
        <div className="modal-overlay" onClick={() => setEditId(null)}>
          {/* 오버레이 클릭시 닫히지 않게 이벤트 버블링 방지 */}
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>북마크 수정</h2>

            <input
              placeholder="제목"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
            />

            <input
              placeholder="URL 링크"
              value={editUrl}
              onChange={(e) => setEditUrl(e.target.value)}
            />

            <input
              placeholder="설명"
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
            />

            <button onClick={handleUpdate}>수정 완료</button>
          </div>
        </div>
      )}
    </>
  );
}
