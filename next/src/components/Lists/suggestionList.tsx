import { GigSuggestion } from "@/types";
import styles from "./list.module.scss";

interface SuggestionListProps {
    suggestionPrompt: string;
    suggestions: GigSuggestion[];
    handleSuggestionClick: (suggestionId: string) => void;
}

const SuggestionList = ({ suggestionPrompt, suggestions, handleSuggestionClick }: SuggestionListProps) => {
    return (
        <div className={styles.suggestionList}>
            <h2>{`You are looking for: ${suggestionPrompt}`}</h2>
            {suggestions.map((suggestion: GigSuggestion) => (
                <div className={styles.suggestion} key={suggestion.id}>
                    <h3>{suggestion.name}</h3>
                    <p>{suggestion.reason}</p>
                    <button onClick={() => handleSuggestionClick(suggestion.id)}>Go to gig</button>
                </div>
            ))}
        </div>
    )
}

export default SuggestionList