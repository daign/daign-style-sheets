/**
 * Style selector describing the criteria for where a style should apply.
 */
export class StyleSelector {
  /**
   * The class names to which the style should apply.
   */
  private classNames: string[] = [];

  /**
   * Constructor.
   * @param s - Concatenated string of several class names to initialize with. All starting with a
   * period, e.g. '.controlPoint.selected'. Optional.
   */
  public constructor( s?: string ) {
    if ( s && s.charAt( 0 ) === '.' ) {
      this.classNames = s.split( '.' ).slice( 1 );
    }
  }

  /**
   * Returns whether the given selector falls into the pool of matching selectors defined by this
   * object. A given selector only matches if all its parts are also part of this object. However
   * the object can also have other parts not found in the given selector. Order does not matter.
   * @param selector - The given selector.
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

  /**
   * Compares the priority for two selectors.
   * @param selector - The second selector.
   * @returns -1 when priority of first is less than priority of second selector
   *           0 when priority of both selectors is equal
   *           1 when priority of first is greater than priority of second selector
   */
  public comparePriority( selector: StyleSelector ): number {
    const sign = ( x: number ): number => Number( x > 0 ) - Number( x < 0 );

    /* Selectors that contain more class names are more specific than others and should have a
     * higher priority when processing style rules. */
    return sign( this.classNames.length - selector.classNames.length );
  }
}
