import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import { useTheme } from "./theme";
import {
  Home,
  Experience,
  Projects,
  Collaborations,
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

// Space-theme background (star-field + canvas game). Mounted OUTSIDE <Layout> so
// "press SPACE to play" can dim the portfolio without dimming the game. Code-split
// so its weight only loads on the SPACE theme.
const SpaceScene = lazy(() => import("./components/SpaceScene"));
function SpaceGate() {
  const { theme } = useTheme();
  if (theme !== "space") return null;
  return (
    <Suspense fallback={null}>
      <SpaceScene />
    </Suspense>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <SpaceGate />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/experience" element={<Experience />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/collaborations" element={<Collaborations />} />
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
