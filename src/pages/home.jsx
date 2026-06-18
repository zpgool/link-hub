import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export default function Home() {
  const [bookmarks, setBookmarks] = useState([]);

  const fetchBookmarks = async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();

    console.log("session:", session);

    const user = session?.user;

    if (!user) return;

    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", user.id);

    console.log("data:", data);

    if (error) console.log(error);
    else setBookmarks(data);
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <div>
      <h1>Home</h1>

      {bookmarks.length === 0 ? (
        <p>북마크 없음</p>
      ) : (
        bookmarks.map((item) => (
          <div key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <a href={item.url} target="_blank">링크</a>
          </div>
        ))
      )}
    </div>
  );
}