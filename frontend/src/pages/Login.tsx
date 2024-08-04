import styles from "./Login.module.css";
import { useState } from "react";
import RestrictedDialog from "../components/RestrictedDialog";
import Alert from "../components/Alert";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [isFlipped, setIsFlipped] = useState(false);

  const navigate = useNavigate();

  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleUserLogin = async () => {
    setIsLoading(true);

    await fetch("http://localhost:8080/user/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then(async (response) => {
        if (!response.ok) {
          const errorContent = await response.text();
          Alert({
            title: `Bad Request - ${response.status.toString()}`,
            text: errorContent,
            icon: "error",
          })();
          throw new Error(errorContent);
        }
        return response;
      })
      .then(async (data) => {
        sessionStorage.setItem("token", await data.text());
        navigate("/user/shop");
      })
      .catch((error) => {
        console.error(error.message);
      })
      .finally(() => setIsLoading(false));
  };

  const handleUserRegister = async () => {
    setIsLoading(true);

    await fetch("http://localhost:8080/user/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email, password: password }),
    })
      .then(async (response: Response) => {
        if (!response.ok) {
          const errorContent = await response.text();
          Alert({
            title: `Bad Request - ${response.status.toString()}`,
            text: errorContent,
            icon: "error",
          })();
          throw new Error(errorContent);
        }
        return response;
      })
      .then((data) => {
        setIsDialogOpen(true);
        console.log(data);
      })
      .catch((error) => {
        console.error(error.message);
      })
      .finally(() => setIsLoading(false));
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div className={`${styles.body} ${styles.a} ${styles.label}`}>
      <div
        style={{}}
        className={`{${styles.card_container} ${
          isFlipped ? `${styles.is_flipped}` : ""
        }`}
      >
        <div
          className={styles.card}
          style={{ display: "flex", backgroundColor: "#fbfbfb" }}
          id={styles.card}
        >
          <div className={styles.card_front}>
            <div id={styles.card_content}>
              <div id={styles.card_title}>
                <h2>LOGIN</h2>
                <div className={styles.underline_title}></div>
              </div>
              <div className={styles.form}>
                <label style={{ paddingTop: "13px" }}>&nbsp;Email</label>
                <input
                  id={styles.user_email}
                  className={styles.form_content}
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
                <div className={styles.form_border}></div>
                <label style={{ paddingTop: "22px" }}>&nbsp;Password</label>
                <input
                  id={styles.user_password}
                  className={styles.form_content}
                  type="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <div className={styles.form_border}></div>
                <a href="#">
                  <legend id={styles.forgot_pass}>忘記密碼?</legend>
                </a>
                <input
                  id={styles.submit_btn}
                  type="submit"
                  name="submit"
                  value="登入"
                  onClick={() => handleUserLogin()}
                ></input>

                <a
                  href="#"
                  id={styles.loginButton}
                  style={{ marginTop: "28px" }}
                  onClick={() => handleFlip()}
                >
                  還沒有帳號嗎？點擊註冊
                </a>
              </div>
            </div>
          </div>

          <div style={{}} className={styles.card_back}>
            <div id={styles.card_content}>
              <div id={styles.card_title}>
                <h2>REGISTER</h2>
                <div className={styles.underline_title}></div>
              </div>
              <div className={styles.form}>
                <label style={{ paddingTop: "13px" }}>&nbsp;Email</label>
                <input
                  id={styles.user_email}
                  className={styles.form_content}
                  type="email"
                  name="email"
                  value={email}
                  onChange={handleEmailChange}
                  required
                />
                <div className={styles.form_border}></div>
                <label style={{ paddingTop: "22px" }}>&nbsp;Password</label>
                <input
                  id={styles.user_password}
                  className={styles.form_content}
                  type="password"
                  name="password"
                  value={password}
                  onChange={handlePasswordChange}
                  required
                />
                <div className={styles.form_border}></div>

                <input
                  style={{ marginTop: "20px" }}
                  id={styles.submit_btn}
                  type="submit"
                  name="submit"
                  value={isLoading ? "處理中.." : "註冊"}
                  disabled={isLoading}
                  onClick={handleUserRegister}
                />
                <a
                  style={{ marginTop: "30px" }}
                  href="#"
                  id={styles.registerButton}
                  onClick={() => handleFlip()}
                >
                  已經有帳號了嗎？點擊登入
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <RestrictedDialog
        title="請輸入驗證碼"
        content="已將驗證碼傳入您的信箱中，請查閱"
        email={email}
        open={isDialogOpen}
        verifyUrl="http://localhost:8080/user/register/verify"
      />
    </div>
  );
}
