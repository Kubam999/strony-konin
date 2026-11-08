import Nav from './components/Nav';
import Hero from './components/Hero';
import Realizacje from './components/Realizacje';
import Footer from './components/Footer';
import SmoothScroll from './components/SmoothScroll';

export default function App() {
  return (
    <>
      <a className="skip" href="#tresc">
        Przejdź do treści
      </a>
      <SmoothScroll />
      <Nav />
      <main id="tresc">
        <Hero />
        <Realizacje />
      </main>
      <Footer />
    </>
  );
}
