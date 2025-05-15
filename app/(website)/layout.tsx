import Footer from "../Components/Footer";
import Nav from "../Components/Nav";

export default function MainWebsiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Nav />
      {children}
      <Footer />
    </>
  );
}
