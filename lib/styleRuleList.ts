import { StyleRule } from './styleRule';

/**
 * Class for an ordered list of style rules.
 */
export class StyleRuleList {
  private _rules: StyleRule[] = [];

  /**
   * Constructor.
   */
  public constructor() {}

  /**
   * Add a style rule to the end of the list.
   * @param rule The style rule to add.
   */
  public addRule( rule: StyleRule ): void {
    this._rules.push( rule );
  }

  /**
   * Apply a callback function to every entry of the list.
   * @param callback The callback to apply.
   */
  public forEach( callback: any ): void {
    this._rules.forEach( callback );
  }
}
