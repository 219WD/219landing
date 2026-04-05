import { COPY } from '../constants/theme';

export default function HeroHeadline() {
  return (
    <h1 className="hero-headline">
      {COPY.headlinePlain}
      <em className="hero-headline__accent">{COPY.headlineAccent}</em>
    </h1>
  );
}