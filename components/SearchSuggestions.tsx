
import React from 'react';

interface SearchSuggestionsProps {
  html: string[];
}

/**
 * Renders Google's Search suggestion chips (groundingMetadata.searchEntryPoint.renderedContent).
 * Grounding with Google Search requires displaying these whenever grounded results are shown.
 * The HTML/CSS is produced by the Gemini API and must be rendered as-is.
 */
const SearchSuggestions: React.FC<SearchSuggestionsProps> = ({ html }) => {
  if (html.length === 0) return null;

  return (
    <div className="space-y-2">
      {html.map((content, i) => (
        <div key={i} dangerouslySetInnerHTML={{ __html: content }} />
      ))}
    </div>
  );
};

export default SearchSuggestions;
