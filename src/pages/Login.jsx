import { useState } from "react";
import { supabase } from "../lib/supabase";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error) {
        console.log(error.message);

        let message = "로그인에 실패했습니다.";

        if (error.message.includes("Invalid login credentials")) {
          message = "이메일 또는 비밀번호가 올바르지 않습니다.";
        }

        alert(message);
        return;
      }
    } else {
      navigate("/home");
    }
  };

  return (
    <div className="login_page">
      <div className="login_card">
        <h1>LinkHub Login</h1>

        <input placeholder="email" onChange={(e) => setEmail(e.target.value)} />

        <input
          placeholder="password"
          type="password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button onClick={handleLogin}>로그인</button>

        <button className="signup_btn" onClick={() => navigate("/signup")}>
          회원가입
        </button>
      </div>
    </div>
  );
}
