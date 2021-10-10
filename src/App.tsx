import { useReducer, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub } from "@fortawesome/free-brands-svg-icons";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { QuoteAndAuthor } from "./components/Quote";
import { useHistory, withRouter, useLocation } from "react-router-dom";
import {
  adjectiveListA,
  adjectiveListB,
  nounList,
  colors,
} from "./StringTokens";

interface ShakeState {
  q1: string;
  q2: string;
  q3: string;
  lock1: boolean;
  lock2: boolean;
  lock3: boolean;
  shouldRewriteHistory: boolean;
}

function App(): JSX.Element {
  const defaultState: ShakeState = {
    q1: "",
    q2: "",
    q3: "",
    lock1: false,
    lock2: false,
    lock3: false,
    shouldRewriteHistory: false,
  };

  const history = useHistory();
  const location = useLocation();

  const reducer = (state: ShakeState, newState: ShakeState) => ({
    ...state,
    ...newState,
  });
  const [state, setState] = useReducer(reducer, defaultState);

  const getRandomStringFromArray = (arr: string[]): string => {
    const num = Math.floor(Math.random() * arr.length);
    return arr[num];
  };

  const isTokenInDictionary = (token: string, dictionary: string[]) => {
    return dictionary.some((word) => word.toLowerCase() == token.toLowerCase());
  };

  const generateRandomQuote = (force: boolean, path?: string): void => {
    const tokens = path || location.pathname;
    const usingPath = tokens === path;
    const splitLocation = tokens.split("/").filter(function (el) {
      return el;
    });

    const isValidPathLength = splitLocation.length === 3;
    let isValidPath = false;
    if (isValidPathLength) {
      // check items in path exist in dictionary
      const token1Valid = isTokenInDictionary(splitLocation[0], adjectiveListA);
      const token2Valid = isTokenInDictionary(splitLocation[1], adjectiveListB);
      const token3Valid = isTokenInDictionary(splitLocation[2], nounList);
      isValidPath = token1Valid && token2Valid && token3Valid;
    }
    // if url has 3 in path, parse that to see if it's valid and use those values
    if (isValidPath && !force) {
      setState({
        ...state,
        q1: splitLocation[0],
        q2: splitLocation[1],
        q3: splitLocation[2],
        shouldRewriteHistory: false,
      });
    } else {
      // else, get new values and set state and browser history
      const q1update = lock1 ? q1 : getRandomStringFromArray(adjectiveListA);
      const q2update = lock2 ? q2 : getRandomStringFromArray(adjectiveListB);
      const q3update = lock3 ? q3 : getRandomStringFromArray(nounList);
      setState({
        ...state,
        q1: q1update,
        q2: q2update,
        q3: q3update,
        shouldRewriteHistory: !usingPath,
      });
    }
  };

  const dayOfWeek = (): number => {
    const d = new Date();
    return d.getDay();
  };

  const invertLockState = (i: number): void => {
    let lockState = false;
    switch (i) {
      case 1:
        lockState = state.lock1;
        break;
      case 2:
        lockState = state.lock2;
        break;
      default:
        lockState = state.lock3;
    }
    setState({
      ...state,
      ["lock" + i]: !lockState,
    });
  };

  const { q1, q2, q3, lock1, lock2, lock3, shouldRewriteHistory } = state;

  useEffect(() => {
    if (q1 && q2 && q3 && shouldRewriteHistory) {
      history.push(`/${q1}/${q2}/${q3}`);
      document.title = `Shakespeare Insulter: ${q1} ${q2} ${q3}`;
    }
  }, [q1, q2, q3]);

  useEffect(() => {
    // first-time logic -- check URL parameters for vars and generate quote or set quote to vars
    generateRandomQuote(false);
  }, []);

  useEffect(() => {
    // handle browser back button and load quote if it's valid
    return history.listen(() => {
      if (history.action === "POP") {
        generateRandomQuote(false, history.location.pathname);
      }
    });
  }, []);

  return (
    <div
      style={{
        background: "url(/shakespeare.jpg) no-repeat top center fixed",
        backgroundSize: "cover",
      }}
    >
      <QuoteAndAuthor
        generateRandomQuote={generateRandomQuote}
        invertLockState={invertLockState}
        quote={[q1, q2, q3]}
        lockState={[lock1, lock2, lock3]}
        colors={colors[dayOfWeek()]}
      />
      <footer>
        Made with <FontAwesomeIcon icon={faHeart} color="red" title="Love" /> by{" "}
        <a href="https://twitter.com/scottpdawson">@scottpdawson</a> at{" "}
        <a
          className="github"
          title="Open source on Github"
          href="https://github.com/scottpdawson/shakespeare-insults"
        >
          <FontAwesomeIcon icon={faGithub} title="Github" />
        </a>
      </footer>
    </div>
  );
}

export default withRouter(App);
