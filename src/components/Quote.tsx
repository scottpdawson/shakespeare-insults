import { RefObject, useLayoutEffect, useRef } from "react";
import { gsap } from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faUnlock, faSyncAlt } from "@fortawesome/free-solid-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";

interface QuoteProps {
  quote: string[];
  lockState: boolean[];
  invertLockState(i: number): void;
  generateRandomQuote(force?: boolean, path?: string): void;
  colors: string[];
}

const gsapFrom = {
  opacity: 0,
};

const gsapTo = {
  opacity: 1,
  duration: 1.2,
  stagger: 0.2,
};

const firstIsVowel = (s: string) => {
  return ["a", "e", "i", "o", "u"].indexOf(s[0].toLowerCase()) !== -1;
};

const words = [0, 1, 2];

export const QuoteAndAuthor = (props: QuoteProps): JSX.Element => {
  const { quote, generateRandomQuote, colors, lockState, invertLockState } =
    props;
  const questionRefs: RefObject<HTMLElement>[] = [];
  words.forEach((word) => {
    questionRefs.push(useRef<HTMLElement>(null));
    useLayoutEffect(() => {
      gsap.fromTo(questionRefs[word].current, gsapFrom, gsapTo);
    }, [quote[word]]);
  });
  return (
    <div>
      <div className="quote">
        {words.map((word, i) => (
          <div
            key={word + i}
            className="quote-text"
            style={{ backgroundColor: `${colors[word]}ee` }}
          >
            <span ref={questionRefs[word]}>{quote[word]}</span>
            <div
              className={`appIcon ${lockState[word] ? "locked" : "unlocked"}`}
              title={lockState[word] ? "Locked" : "Unlocked"}
              onClick={() => {
                invertLockState(word + 1);
              }}
            >
              {lockState[word] ? (
                <FontAwesomeIcon icon={faLock} />
              ) : (
                <FontAwesomeIcon icon={faUnlock} />
              )}
            </div>
          </div>
        ))}
      </div>
      <button
        className="appIcon tweetIcon"
        title="Tweet This"
        onClick={() => {
          window.open(
            "https://twitter.com/intent/tweet/?text=" +
              encodeURIComponent(
                `How shall I insult thee? Perchance I should call ye ${
                  firstIsVowel(quote[0]) ? "an" : "a"
                } ${quote.join(" ")}? Ay, perchance! ${
                  window.location.href
                } #shakespeareInsults via @scottpdawson`
              )
          );
        }}
      >
        <FontAwesomeIcon icon={faTwitter} />
      </button>
      <button
        className="appIcon generateIcon"
        onClick={() => {
          generateRandomQuote(true);
        }}
        type="submit"
        title="Refresh Insult"
      >
        <FontAwesomeIcon icon={faSyncAlt} />
      </button>
    </div>
  );
};
