import styles from "./auth-panel.module.css";

export function AuthPanel() {
  return <div className={styles.panel}>
    <a href="/api/v1/auth/google">Continue with Google</a>
    <p>No password is stored by Spark Plug. Google returns only the identity fields approved on its consent screen.</p>
  </div>;
}
