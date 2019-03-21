import { StyleRule } from './styleRule';

/**
 * Class for an ordered list of style rules.
 */
export class StyleRuleList {
  /**
   * List of style rules. Sorted in ascending order by priority.
   */
  private _rules: StyleRule[] = [];

  /**
   * Constructor.
   */
  public constructor() {}

  /**
   * Add a style rule to the list.
   * @param rule The style rule to add.
   */
  public addRule( rule: StyleRule ): void {
    /* Adding should keep the list sorted. Rules with higher priority come last. If priority of two
     * rules is equal then the rule added last has the higher priority. Sorting must be stable.
     * Therefore this implements its own sorting method similar to insertion sort. */
    let index = this._rules.length;
    const isLess = -1;

    /* Determine the index of where to insert. As long as the rule has less priority than the rule
     * at the preceding index the index is decreased. */
    while ( index > 0 && rule.comparePriority( this._rules[ index - 1 ] ) === isLess ) {
      index -= 1;
    }

    // Insert at index position.
    this._rules.splice( index, 0, rule );
  }

  /**
   * Apply a callback function to every entry of the list.
   * @param callback The callback to apply.
   */
  public forEach( callback: ( rule: StyleRule ) => void ): void {
    this._rules.forEach( callback );
  }
}
