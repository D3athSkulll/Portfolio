import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import {
  Home,
  Experience,
  Projects,
  Skills,
  Designs,
  EducationPage,
  Extracurricular,
  TestScores,
  Likes,
  Wins,
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
          <Route path="/designs" element={<Designs />} />
          <Route path="/education" element={<EducationPage />} />
          <Route path="/test-scores" element={<TestScores />} />
          <Route path="/extracurricular" element={<Extracurricular />} />
          <Route path="/wins" element={<Wins />} />
          <Route path="/likes" element={<Likes />} />
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
