import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

import { getAuthErrorMessage } from "../utils/authError";

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

    if (error) {
      setErrorMsg(getAuthErrorMessage(error));
      console.log(error.message);
      return;
    }

    if (!data?.user?.identities || data.user.identities.length === 0) {
      setErrorMsg("이미 가입된 이메일입니다.");
      return;
    }

    alert("회원가입 성공!");
    navigate("/");
  };

  return (
    <div className="login_page">
      <div className="login_card">
        <h1>회원가입</h1>

        <input
          placeholder="이메일을 입력하세요"
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          placeholder="비밀번호를 입력하세요"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* 에러 메시지 UI */}
        {errorMsg && <p className="error-text">{errorMsg}</p>}

        <button onClick={handleSignup}>가입하기</button>

        <button className="signup_btn" onClick={() => navigate("/")}>
          이미 계정이 있나요? 로그인
        </button>
      </div>
    </div>
  );
}
