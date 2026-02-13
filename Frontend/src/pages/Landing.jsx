import Hero from "../components/Hero";

/**
 * Landing page
 * - Currently just the hero section, but you can
 *   extend this with additional intro content later.
 */
function Landing({ onGetStarted }) {
  return (
    <div>
      <Hero onGetStarted={onGetStarted} />
    </div>
  );
}

export default Landing;

