import { Routes, Route } from "react-router-dom";
import { motion } from "framer-motion";
import ProfileVerifier from "@/components/pages/ProfileVerifier";

function App() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      <Routes>
        <Route path="/" element={<ProfileVerifier />} />
      </Routes>
    </motion.div>
  );
}

export default App;