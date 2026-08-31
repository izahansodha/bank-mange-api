import Sidebar from "./Sidebar";
import Header from "./Header";

function Layout({ children }) {
  return (
    <div style={styles.layout}>

      <Sidebar />

      <div style={styles.content}>


        <main style={styles.main}>
          {children}
        </main>

      </div>

    </div>
  );
}

const styles = {
  layout: {
    minHeight: "100vh",
    backgroundColor: "#f8fafc",
  },

  content: {
    marginLeft: "250px",
    minHeight: "100vh",
  },

  main: {
    padding: "32px",
    boxSizing: "border-box",
  },
};

export default Layout;