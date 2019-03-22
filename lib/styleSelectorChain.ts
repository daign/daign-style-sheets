import { StyleSelector } from './styleSelector';

/**
 * A chain of StyleSelectors.
 * Represents the style hierarchy applying to a node in a tree document as defined by its ancestors.
 */
export class StyleSelectorChain {
  /**
   * List of StyleSelectors, starting with StyleSelector of topmost node in hierarchy.
   */
  private _chain: StyleSelector[] = [];

  /**
   * Get the length of the chain list.
   */
  public get length(): number {
    return this._chain.length;
  }

  /**
   * Constructor.
   */
  public constructor() {}

  /**
   * Add a selector to the end of the chain.
   * @param selector The selector to add.
   */
  public addSelector( selector: StyleSelector ): void {
    this._chain.push( selector );
  }

  /**
   * Create and return a subchain.
   * @param index The index from where to start the subchain.
   * @returns The subchain object.
   */
  public createSubChain( index: number ): StyleSelectorChain {
    const result = new StyleSelectorChain();
    result._chain = this._chain.slice( index );
    return result;
  }

  /**
   * Get a selector from the chain.
   * @param index The index of the selector to get.
   * @returns The style selector object.
   */
  public getSelector( index: number ): StyleSelector {
    return this._chain[ index ];
  }

  /**
   * Get the index of the first matching selector in the chain, searched from front to end.
   * @param selector The selector to match with.
   * @returns The index or -1 if no entry in the chain matches.
   */
  public getFirstMatchIndex( selector: StyleSelector ): number {
    for ( let i = 0; i < this.length; i += 1 ) {
      if ( this._chain[ i ].match( selector ) ) {
        return i;
      }
    }

    return -1;
  }
}
