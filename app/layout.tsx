import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import { Inter } from "next/font/google";

import ModalProvider from "@/providers/ModalProvider";
import ToasterProvider from "@/providers/ToastProvider";

const inter = Inter({ subsets: ["latin"] });

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata = {
  title: "Admin Dashboard",
  description: "Admin Dashboard",
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={inter.className}>
          <ToasterProvider />
          {/* the root page is whats causing the ModalProvider to render,
          but also since we put it here as a provider, any time the onOpen
          is called, the Modal will pop up */}
          {/* ModalProvider calls StoreModal, which calls Modal, but only if
          isOpen is true, hence if not true, we load first store */}
          <ModalProvider />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
