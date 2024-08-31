import { createContext, useEffect, useMemo, useState } from "react";
import { TFeedbackItem } from "../lib/types";

type TFeedbackItemCobtext = {
  companyList: string[];
  handleAddToList: (text: string) => void;
  isLoading: boolean;
  errorMessage: string;
  filteredFeedbackItems: TFeedbackItem[];
  handleSelectedCompany: (company: string) => void;
};

type FeedbackItemsContextProviderProps = {
  children: React.ReactNode;
};

export const FeedbackItemsContext = createContext<TFeedbackItemCobtext | null>(
  null
);

export default function FeedbackItemsContextProvider({
  children,
}: FeedbackItemsContextProviderProps) {
  const [feedbackItems, setFeedbackItems] = useState<TFeedbackItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");

  const companyList = useMemo(
    () =>
      feedbackItems
        .map((item) => item.company)
        .filter((company, index, array) => {
          return array.indexOf(company) === index;
        }),
    [feedbackItems]
  );
  const filteredFeedbackItems = useMemo(
    () =>
      selectedCompany
        ? feedbackItems.filter((item) => item.company === selectedCompany)
        : feedbackItems,
    [feedbackItems, selectedCompany]
  );

  const handleAddToList = async (text: string) => {
    const companyName = text
      .split(" ")
      .find((word) => word.includes("#"))!
      .substring(1);

    const newItem: TFeedbackItem = {
      id: new Date().getTime(),
      text: text,
      upvoteCount: 0,
      daysAgo: 0,
      company: companyName,
      badgeLetter: companyName.substring(0, 1).toUpperCase(),
    };
    setFeedbackItems([...feedbackItems, newItem]);

    await fetch(
      "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks/",
      {
        method: "POST",
        body: JSON.stringify(newItem),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    );
  };
  const handleSelectedCompany = (company: string) => {
    setSelectedCompany(company);
  };

  useEffect(() => {
    const fetchFeeedbakItems = async () => {
      setIsLoading(true);

      try {
        const response = await fetch(
          "https://bytegrad.com/course-assets/projects/corpcomment/api/feedbacks/"
        );
        if (!response.ok) {
          throw new Error();
        }
        const data = await response.json();
        setFeedbackItems(data.feedbacks);
      } catch (error) {
        setErrorMessage("Something went wrong. Please try again later.");
      }
      setIsLoading(false);
    };
    fetchFeeedbakItems();
  }, []);

  return (
    <FeedbackItemsContext.Provider
      value={{
        companyList,
        handleAddToList,
        isLoading,
        errorMessage,
        filteredFeedbackItems,
        handleSelectedCompany,
      }}
    >
      {children}
    </FeedbackItemsContext.Provider>
  );
}
