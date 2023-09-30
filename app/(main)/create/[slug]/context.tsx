"use client";

import { createContext, useContext, useState } from "react";

import type { ReactNode } from "react";
import type {
  Prediction,
  PredictionLoadingState,
} from "~/lib/types/predictions";

const PredictionContext = createContext<{
  loadingState: PredictionLoadingState;
  setLoadingState: (loadingState: PredictionLoadingState) => void;
  prediction: Prediction | null;
  setPrediction: (prediction: Prediction | null) => void;
  isUsingTemplate: boolean;
  setIsUsingTemplate: (isUsingTemplate: boolean) => void;
  isPublished: boolean;
  setIsPublished: (isPublished: boolean) => void;
}>({
  loadingState: "idle",
  setLoadingState: (loadingState: PredictionLoadingState) =>
    console.log(loadingState),
  prediction: null,
  setPrediction: (prediction) => console.log(prediction),
  isUsingTemplate: false,
  setIsUsingTemplate: (isUsingTemplate) => console.log(isUsingTemplate),
  isPublished: false,
  setIsPublished: (isPublished) => console.log(isPublished),
});

export function PredictionContextProvider(props: { children: ReactNode }) {
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [loadingState, setLoadingState] =
    useState<PredictionLoadingState>("idle");
  const [isUsingTemplate, setIsUsingTemplate] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  return (
    <PredictionContext.Provider
      value={{
        loadingState,
        setLoadingState,
        prediction,
        setPrediction,
        isUsingTemplate,
        setIsUsingTemplate,
        isPublished,
        setIsPublished,
      }}
    >
      {props.children}
    </PredictionContext.Provider>
  );
}

export const usePredictionContext = () => useContext(PredictionContext);
