import { IStyleDeclaration } from './styleDeclaration';
import { StyleRule } from './styleRule';
import { StyleSelectorChain } from './styleSelectorChain';
import { StyleSheet } from './styleSheet';

/**
 * Class for deriving style information.
 */
export class StyleProcessor<T extends IStyleDeclaration> {
  /**
   * Constructor.
   */
  public constructor() {}

  /**
   * Calculate the resulting style declaration derived from the elements selector chain and the
   * style sheet.
   * @param styleSheet - The given style sheet.
   * @param selectorChain - The selector chain of the element.
   * @param declarationType - The type of the returned style declaration.
   * @param elementStyle - A style assigned directly to the element. Optional.
   * @returns The calculated style declaration.
   */
  public calculateStyle(
    styleSheet: StyleSheet<T>, selectorChain: StyleSelectorChain, declarationType: new () => T,
    elementStyle?: T
  ): T {
    const result = new declarationType();

    // A style assigned directly to the element has the highest priority.
    if ( elementStyle ) {
      result.complementWith( elementStyle );
    }

    /* Look for rules matching any left-sided subchain of the selector chain. Start with the longer
     * subchains because they match deeper into the element hierarchy and should therefore have a
     * higher priority. */
    for ( let i = 0; i < selectorChain.length; i += 1 ) {
      const subChain = selectorChain.clone().dropSelectors( i );

      // For every rule determine whether it matches the subchain starting from the end.
      styleSheet.forEach( ( rule: StyleRule ): void => {
        if ( subChain.matchFromEnd( rule.selectorChain ) ) {
          /* Add attributes from matching rules to the declaration if the values are null. Do not
           * override any values already set because they were set by rules with higher priority. */
          result.complementWith( rule.declaration );
        }
      } );
    }

    return result;
  }
}
