import { useContext } from "react";
import { FeedbackItemsContext } from "../contexts/FeedbackItemsContextProvider";

export function useFeedbackItemsContext() {
  const context = useContext(FeedbackItemsContext);

  if (!context) {
    throw new Error(
      "FeedbackList must be used within a FeedbackItemsContextProvider"
    );
  }

  return context;
}
