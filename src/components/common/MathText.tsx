import React from 'react';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

interface MathTextProps {
    children: string;
    className?: string;
}

/**
 * MathText Component
 * 
 * Renders text with LaTeX math formulas. Use $ for inline math and $$ for block math.
 * 
 * Examples:
 * - Subscript: "R$_e$" or "$R_e$" → Rₑ
 * - Superscript: "$10^{-4}$" → 10⁻⁴
 * - Scientific notation: "$6.25 \times 10^{-4}$"
 * - Fractions: "$\frac{GM}{R^2}$"
 * - Greek letters: "$\alpha, \beta, \theta$"
 */
export function MathText({ children, className = '' }: MathTextProps): React.ReactElement {
    if (!children) return <span className={className}></span>;

    // Parse text for LaTeX patterns
    // Block math: $$...$$
    // Inline math: $...$
    const parts: React.ReactNode[] = [];
    let remaining = children;
    let key = 0;

    // First, handle block math ($$...$$)
    const blockMathRegex = /\$\$([\s\S]*?)\$\$/g;
    let lastIndex = 0;
    let match;

    // Process the text to find math expressions
    const processInlineMath = (text: string): React.ReactNode[] => {
        const inlineParts: React.ReactNode[] = [];
        const inlineRegex = /\$((?:[^$\\]|\\.)+)\$/g;
        let inlineLastIndex = 0;
        let inlineMatch;

        while ((inlineMatch = inlineRegex.exec(text)) !== null) {
            // Add text before the match
            if (inlineMatch.index > inlineLastIndex) {
                inlineParts.push(
                    <span key={`text-${key++}`}>{text.substring(inlineLastIndex, inlineMatch.index)}</span>
                );
            }

            // Add the inline math
            try {
                inlineParts.push(
                    <InlineMath key={`math-${key++}`} math={inlineMatch[1]} />
                );
            } catch (error) {
                // If LaTeX parsing fails, show the original text
                inlineParts.push(
                    <span key={`error-${key++}`} className="text-red-500">{inlineMatch[0]}</span>
                );
            }

            inlineLastIndex = inlineMatch.index + inlineMatch[0].length;
        }

        // Add remaining text
        if (inlineLastIndex < text.length) {
            inlineParts.push(
                <span key={`text-${key++}`}>{text.substring(inlineLastIndex)}</span>
            );
        }

        return inlineParts.length > 0 ? inlineParts : [<span key={`text-${key++}`}>{text}</span>];
    };

    while ((match = blockMathRegex.exec(remaining)) !== null) {
        // Add text before the block math (with inline math processing)
        if (match.index > lastIndex) {
            const textBefore = remaining.substring(lastIndex, match.index);
            parts.push(...processInlineMath(textBefore));
        }

        // Add the block math
        try {
            parts.push(
                <div key={`block-${key++}`} className="my-2">
                    <BlockMath math={match[1]} />
                </div>
            );
        } catch (error) {
            parts.push(
                <div key={`error-${key++}`} className="text-red-500 my-2">{match[0]}</div>
            );
        }

        lastIndex = match.index + match[0].length;
    }

    // Process remaining text for inline math
    if (lastIndex < remaining.length) {
        parts.push(...processInlineMath(remaining.substring(lastIndex)));
    }

    // If no math was found, return plain text
    if (parts.length === 0) {
        return <span className={className}>{children}</span>;
    }

    return <span className={className}>{parts}</span>;
}

export default MathText;
