import { IStyleDeclaration } from './styleDeclaration';
import { StyleRuleList } from './styleRuleList';
import { StyleSelector } from './styleSelector';

/**
 * A style rule consisting of a style selector and a style declaration plus possible child rules.
 */
export class StyleRule {
  /**
   * The style selector specifying when the style should apply.
   */
  public selector: StyleSelector;

  /**
   * The declaration containing the style attributes.
   */
  public declaration: IStyleDeclaration;

  /**
   * List of child rules.
   */
  public childRules: StyleRuleList = new StyleRuleList();

  /**
   * Constructor.
   * @param selector The style selector.
   * @param declaration The style declaration.
   */
  public constructor( selector: StyleSelector, declaration: IStyleDeclaration ) {
    this.selector = selector;
    this.declaration = declaration;
  }

  /**
   * Compares the priority for two style rules.
   * @param rule The second rule.
   * @returns -1 when priority of first is less than priority of second rule
   *           0 when priority of both rules is equal
   *           1 when priority of first is greater than priority of second rule
   */
  public comparePriority( rule: StyleRule ): number {
    return this.selector.comparePriority( rule.selector );
  }
}
