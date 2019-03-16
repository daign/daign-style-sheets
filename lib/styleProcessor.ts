import { IStyleDeclaration } from './styleDeclaration';
import { StyleRule } from './styleRule';
import { StyleSelector } from './styleSelector';
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
   * @param styleSheet The given style sheet.
   * @param selectorChain The selector chain of the element.
   * @param declarationType The type of the returned style declaration.
   * @returns The calculated style declaration.
   */
  public calculateStyle(
    styleSheet: StyleSheet, selectorChain: StyleSelectorChain, declarationType: new () => T
  ): T {
    const result = new declarationType();

    const traverse = ( rules: StyleRule[], chain: StyleSelector[] ): void => {
      const topSelector = chain[ 0 ];
      rules.forEach( ( rule: StyleRule ): void => {
        if ( topSelector.match( rule.selector ) ) {
          result.overrideWith( rule.declaration );

          const restChain = chain.slice( 1 );
          if ( restChain.length > 0 ) {
            traverse( rule.childRules, restChain );
          }
        }
      } );
    };

    traverse( styleSheet.rules, selectorChain.chain );

    return result;
  }
}
