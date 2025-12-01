import React, { Dispatch, SetStateAction } from "react";
import { GigSuggestion } from "@/types";
import styles from "./list.module.scss";
import { PILL_OPTIONS } from "@/config";

interface SuggestionListProps {
    suggestionPrompt: string;
    suggestions: GigSuggestion[];
    setSuggestionPrompt: Dispatch<SetStateAction<string>>;
    handleSuggestionClick: (suggestion: GigSuggestion) => void;
}

const SuggestionList = ({
    suggestionPrompt,
    suggestions,
    setSuggestionPrompt,
    handleSuggestionClick
}: SuggestionListProps) => {
    return (
        <div className={styles.suggestionList}>
            <div className={styles.suggestionList__heading}>
                <h2>You wanted:</h2>

                <select
                    id="suggestion-prompts"
                    value={suggestionPrompt}
                    onChange={(e) => setSuggestionPrompt(e.target.value)}
                >
                    {PILL_OPTIONS.map(option => (
                        <option
                            key={option.label}
                            value={option.label}
                        >
                            {option.label}
                        </option>
                    ))}
                </select>
            </div>

            {suggestions.map((suggestion) => (
                <div className={styles.suggestion} key={suggestion.id}>
                    <h3>{suggestion.name}</h3>
                    <p>{suggestion.reason}</p>
                    <button onClick={() => handleSuggestionClick(suggestion)}>
                        Go to gig
                    </button>
                </div>
            ))}
        </div>
    );
};


export default SuggestionList