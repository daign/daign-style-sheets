import { IStyleDeclaration } from './styleDeclaration';
import { StyleRule } from './styleRule';
import { StyleSelector } from './styleSelector';
import { StyleSelectorChain } from './styleSelectorChain';

// E.g. '.polygon.selected {'
const selectorExpression = /^\s*(\.[a-z][\.\w\-]*)\ \{$/;

// E.g. '  fill: green;'
const attributeExpression = /^\s*([a-z][a-z\-]*)\:\ (.+)\;$/;

// E.g. '}'
const ruleEndExpression = /^\s*\}$/;

// E.g. '// Comment'
const commentExpression = /^\s*\/\/\ .+$/;

const emptyLineExpression = /^\s*$/;

/**
 * A style sheet consisting of style rules.
 */
export class StyleSheet<T extends IStyleDeclaration> {
  /**
   * List of style rules. Sorted in descending order by priority.
   */
  private _rules: StyleRule[] = [];

  /**
   * Constructor.
   */
  public constructor() {}

  /**
   * Apply a callback function to every entry of the list.
   * @param callback The callback to apply.
   */
  public forEach( callback: ( rule: StyleRule ) => void ): void {
    // Execution from highest to lowest priority rules.
    this._rules.forEach( callback );
  }

  /**
   * Parse style sheet rules from a string.
   * @param input The input string.
   * @param declarationType The declaration type.
   */
  public parseFromString( input: string, declarationType: new () => T ): void {
    const lines = input.split( '\n' );
    const selectorChainStack: StyleSelectorChain[] = [ new StyleSelectorChain() ];
    const declarationStack: T[] = [];

    lines.forEach( ( line: string, index: number ): void => {
      const selectorMatch = line.match( selectorExpression );
      const attributeMatch = line.match( attributeExpression );
      const ruleEndMatch = line.match( ruleEndExpression );
      const commentMatch = line.match( commentExpression );
      const emptyLineMatch = line.match( emptyLineExpression );

      if ( selectorMatch !== null ) {
        // New selector starts a new rule. Goes one level deeper into the nesting.
        const selector = new StyleSelector( selectorMatch[ 1 ] );

        // Add to selector chain and put the new chain on the stack.
        const newChain = selectorChainStack[ 0 ].clone().addSelector( selector );
        selectorChainStack.unshift( newChain );

        // Put a new declaration object on the stack.
        const newDeclaration = new declarationType();
        declarationStack.unshift( newDeclaration );

      } else if ( attributeMatch !== null ) {
        // Add attribute and value to the declaration on top of the stack.
        const currentDeclaration = declarationStack[ 0 ];
        ( currentDeclaration as any )[ attributeMatch[ 1 ] ] = attributeMatch[ 2 ];

      } else if ( ruleEndMatch !== null ) {
        // Rule ends. Goes one level up in the nesting.
        // Get and remove the objects on top of both stacks.
        const currentChain = selectorChainStack.shift();
        const currentDeclaration = declarationStack.shift();

        if ( currentChain && currentDeclaration ) {
          if ( !currentDeclaration.isEmpty ) {
            // If attributes were set to the declaration then add a rule.
            const newRule = new StyleRule( currentChain, currentDeclaration );
            this.addRule( newRule );
          }
          // Else do nothing, because the declaration has no attributes set.
        } else {
          // Throw error because one of the stacks was empty and returned undefined as top object.
          throw new Error( 'Too many closing brackets in style sheet.' );
        }

      } else if ( commentMatch !== null ) {
        // Comment detected, do nothing.

      } else if ( emptyLineMatch !== null ) {
        // Empty line dectected, do nothing.

      } else {
        // Line did not match any of the defined regular expressions for valid lines.
        throw new Error( `Line ${index + 1} in style sheet could not be parsed.` );
      }
    } );

    if ( selectorChainStack.length > 1 && declarationStack.length > 0 ) {
      // There are unprocessed items on one of the stacks left.
      throw new Error( 'Missing closing brackets in style sheet.' );
    }
  }

  /**
   * Add a style rule to the list.
   * @param rule The style rule to add.
   */
  private addRule( rule: StyleRule ): void {
    /* Adding should keep the list sorted. Rules with higher priority come frist. If priority of two
     * rules is equal then the rule added last has the higher priority. Sorting must be stable.
     * Therefore this implements its own sorting method similar to insertion sort. */
    let index = 0;
    const indexLimit = this._rules.length;
    const isLess = -1;

    /* Determine the index of where to insert. As long as the rule has less priority than the rule
     * at the current index position the index is increased. */
    while ( index < indexLimit && rule.comparePriority( this._rules[ index ] ) === isLess ) {
      index += 1;
    }

    // Insert at index position.
    this._rules.splice( index, 0, rule );
  }
}
