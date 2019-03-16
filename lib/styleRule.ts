import { IStyleDeclaration } from './styleDeclaration';
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
  public childRules: StyleRule[] = [];

  /**
   * Constructor.
   * @param selector The style selector.
   * @param declaration The style declaration.
   */
  public constructor( selector: StyleSelector, declaration: IStyleDeclaration ) {
    this.selector = selector;
    this.declaration = declaration;
  }
}
