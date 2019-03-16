/**
 * Style selector describing the criterias for where a style should apply.
 */
export class StyleSelector {
  /**
   * The class names to which the style should apply.
   */
  public classNames: string[] = [];

  /**
   * Constructor.
   */
  public constructor() {}

  /**
   * Returns whether the given selector falls into the pool of matching selectors defined by this
   * object. A given selector only matches if all its parts are also part of this object. However
   * the object can also have other parts not found in the given selector. Order does not matter.
   * @param selector The given selector.
   * @return Returns the boolean result of the match test.
   */
  public match( selector: StyleSelector ): boolean {
    if ( selector.classNames.length > 0 ) {
      return selector.classNames.every( ( name: string ): boolean => {
        return ( this.classNames.indexOf( name ) !== -1 );
      } );
    } else {
      // If the given selector is empty it should not match.
      return false;
    }
  }
}
