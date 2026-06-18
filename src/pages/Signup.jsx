import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  const handleSignup = async () => {
    setErrorMsg("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    // ❌ 에러 먼저 처리
    if (error) {
      setErrorMsg(error.message);
      return;
    }

    // 🔥 핵심 체크
    if (!data?.user?.identities || data.user.identities.length === 0) {
      setErrorMsg("이미 가입된 이메일입니다.");
      return;
    }

    alert("회원가입 성공!");
    navigate("/");
  };

  return (
    <div>
      <h1>회원가입</h1>

      <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />

      <input
        placeholder="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />

      {errorMsg && <p style={{ color: "red" }}>{errorMsg}</p>}

      <button onClick={handleSignup}>회원가입</button>

      <button onClick={() => navigate("/")}>로그인</button>
    </div>
  );
}
