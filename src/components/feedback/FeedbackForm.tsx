import { useState } from "react";
import { MAX_CHARACTERS } from "../../lib/constants";

type FeedbackFormProps = {
  onAddToList: (text: string) => void;
};

export default function FeedbackForm({
  onAddToList,
}: FeedbackFormProps) {
  const [text, setText] = useState("");
  const charCount = MAX_CHARACTERS - text.length;
  const [showValidIndicator, setShowValidIndicator] =
    useState(false);
  const [showInvalidIndicator, setShowInvalidIndicator] =
    useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newText = e.target.value;
    if (newText.length > MAX_CHARACTERS) {
      return;
    }
    setText(newText);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    //basic validation
    if (text.includes("#") && text.length >= 5) {
      setShowValidIndicator(true);
      setTimeout(() => setShowValidIndicator(false), 2000);
    } else {
      setShowInvalidIndicator(true);
      setTimeout(
        () => setShowInvalidIndicator(false),
        2000
      );

      return;
    }

    onAddToList(text);
    setText("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`form ${
        showValidIndicator && "form--valid"
      } ${showInvalidIndicator && "form--invalid"} `}
    >
      <textarea
        value={text}
        onChange={handleChange}
        id="feedback-textarea"
        placeholder="blabla"
        spellCheck={false}
      />
      <label htmlFor="feedback-textarea">
        Enter your feedback here, remember to #hashtag the
        company
      </label>
      <div>
        <p className="u-italic u-bold">{charCount}</p>
        <button>
          <span>Submit</span>
        </button>
      </div>
    </form>
  );
}
