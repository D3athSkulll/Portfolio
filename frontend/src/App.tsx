import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import {
  Home,
  Experience,
  Projects,
  Skills,
  EducationPage,
  Achievements,
  Resume,
  Contact,
  BlogIndex,
  BlogPost,
  NotFound,
} from "./pages";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/skills" element={<Skills />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/achievements" element={<Achievements />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<BlogIndex />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
