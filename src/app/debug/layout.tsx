import React from "react";
import { geistSans } from "../ui/fonts";
function layout({ children }: { children: React.ReactNode }) {
  return <div className={`${geistSans.className} antialiased`}>{children}</div>;
}
export const metadata = {
  title: "Trie Visualizer",
  description: "Visualize and understand tries interactively",
};
export default layout;
