import { IStyleDeclaration } from './styleDeclaration';
import { StyleSelectorChain } from './styleSelectorChain';

/**
 * A style rule consisting of a style selector chain and a style declaration.
 */
export class StyleRule {
  /**
   * Constructor.
   * @param selectorChain - The style selector specifying when the style should apply.
   * @param declaration - The declaration containing the style attributes.
   */
  public constructor(
    public selectorChain: StyleSelectorChain,
    public declaration: IStyleDeclaration
  ) {}

  /**
   * Compares the priority for two style rules.
   * @param rule - The second rule.
   * @returns -1 when priority of first is less than priority of second rule
   *           0 when priority of both rules is equal
   *           1 when priority of first is greater than priority of second rule
   */
  public comparePriority( secondRule: StyleRule ): number {
    return this.selectorChain.comparePriority( secondRule.selectorChain );
  }
}
