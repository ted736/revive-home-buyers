import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { initGA4, initMetaPixel } from "./lib/analytics";

initGA4();
initMetaPixel();

createRoot(document.getElementById("root")!).render(<App />);
