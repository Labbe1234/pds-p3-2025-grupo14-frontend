import Hero from '../../components/Hero/Hero';
import Cards from '../../components/Cards/Cards';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <Hero />
      <Cards />
    </div>
  );
};

export default HomePage;