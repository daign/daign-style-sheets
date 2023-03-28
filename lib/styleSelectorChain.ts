import { StyleSelector } from './styleSelector';

/**
 * A chain of StyleSelectors.
 * Represents the style hierarchy applying to a node in a tree document as defined by its ancestors.
 */
export class StyleSelectorChain {
  /**
   * List of StyleSelectors, starting with StyleSelector of topmost node in hierarchy.
   */
  private chain: StyleSelector[] = [];

  /**
   * Get the length of the chain list.
   */
  public get length(): number {
    return this.chain.length;
  }

  /**
   * Constructor.
   */
  public constructor() {}

  /**
   * Create and return a copy of the chain.
   * @returns The cloned selector chain.
   */
  public clone(): StyleSelectorChain {
    const newChain = new StyleSelectorChain();
    newChain.chain = this.chain.slice();
    return newChain;
  }

  /**
   * Add a selector to the end of the chain.
   * @param selector - The selector to add.
   * @returns A reference to itself.
   */
  public addSelector( selector: StyleSelector ): StyleSelectorChain {
    this.chain.push( selector );
    return this;
  }

  /**
   * Add a selector to the front of the chain.
   * @param selector - The selector to add.
   * @returns A reference to itself.
   */
  public addSelectorToFront( selector: StyleSelector ): StyleSelectorChain {
    this.chain.unshift( selector );
    return this;
  }

  /**
   * Remove selectors from the end.
   * @param n - The number of selectors to drop from the end.
   * @returns A reference to itself.
   */
  public dropSelectors( n: number ): StyleSelectorChain {
    if ( n > 0 ) {
      this.chain.splice( this.length - n, n );
    }
    return this;
  }

  /**
   * Get a selector from the chain.
   * @param index - The index of the selector to get.
   * @returns The style selector object.
   */
  public getSelector( index: number ): StyleSelector {
    if ( index >= this.length ) {
      throw new Error( 'Selector index out of bounds.' );
    }
    return this.chain[ index ];
  }

  /**
   * Determine whether the chains match. Last selector must always match. From there on all
   * selectors from the rule chain must match to selectors in the original chain in the given order,
   * but in the original chain there can be addional selectors.
   * @param ruleChain - The selector chain to match with.
   * @returns The boolean result of the match.
   */
  public matchFromEnd( ruleChain: StyleSelectorChain ): boolean {
    if ( this.length === 0 || ruleChain.length === 0 ) {
      return false;
    }

    let ruleIndex = ruleChain.length - 1;

    // Last selectors in both chains must match.
    const endSelector = this.getSelector( this.length - 1 );
    if ( !endSelector.match( ruleChain.getSelector( ruleIndex ) ) ) {
      return false;
    }

    // Process selectors from back to front.
    for ( let i = 0; i < this.length; i += 1 ) {
      const selector = this.getSelector( this.length - i - 1 );

      if ( selector.match( ruleChain.getSelector( ruleIndex ) ) ) {
        // If a selector from the rule chain did match, search for next selector of the rule chain.
        ruleIndex -= 1;
        if ( ruleIndex === -1 ) {
          // If ruleIndex turns negative all selectors from rule chain were matched.
          return true;
        }
      }
    }

    // There are unmatched selectors from rule chain left.
    return false;
  }

  /**
   * Compares the priority for two selector chains.
   * @param secondChain - The second selector chain.
   * @returns -1 when priority of first is less than priority of second chain
   *           0 when priority of both chains is equal
   *           1 when priority of first is greater than priority of second chain
   */
  public comparePriority( secondChain: StyleSelectorChain ): number {
    const sign = ( x: number ): number => Number( x > 0 ) - Number( x < 0 );

    /* Selector chains that contain more selectors are more specific than others and should have a
     * higher priority when processing style rules. */
    const result = sign( this.length - secondChain.length );

    if ( result === 0 ) {
      // If the length is equal compare the selectors themselves.
      for ( let i = 0; i < this.length; i += 1 ) {
        // From back to front.
        const index = this.length - i - 1;
        const innerResult = this.getSelector( index ).comparePriority(
          secondChain.getSelector( index )
        );
        // When two selectors with different priority are found this is the result.
        if ( innerResult !== 0 ) {
          return innerResult;
        }
      }
    }

    return result;
  }
}
