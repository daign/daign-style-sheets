import { StyleSelector } from './styleSelector';

/**
 * A chain of StyleSelectors.
 * Represents the style hierarchy applying to a node in a tree document as defined by its ancestors.
 */
export class StyleSelectorChain {
  /**
   * List of StyleSelectors, starting with StyleSelector of root node.
   */
  public chain: StyleSelector[] = [];

  /**
   * Constructor.
   */
  public constructor() {}
}
