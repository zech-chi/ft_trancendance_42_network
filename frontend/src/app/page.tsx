// src/app/page.tsx
import { redirect } from "next/navigation";

export default function Home() {
  // redirect root `/` to `/protected`
  redirect("/protected");
}
