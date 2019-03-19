import { IStyleDeclaration } from './styleDeclaration';
import { StyleRule } from './styleRule';
import { StyleSelector } from './styleSelector';
import { StyleSelectorChain } from './styleSelectorChain';
import { StyleSheet } from './styleSheet';

/**
 * Interface for partial evaluation tasks consisting of a set of rules and a selector chain.
 */
interface ITaskItem {
  rules: StyleRule[];
  chain: StyleSelector[];
}

/**
 * Class for deriving style information.
 */
export class StyleProcessor<T extends IStyleDeclaration> {
  /**
   * Constructor.
   */
  public constructor() {}

  /**
   * Calculate the resulting style declaration derived from the elements selector chain and the
   * style sheet.
   * @param styleSheet The given style sheet.
   * @param selectorChain The selector chain of the element.
   * @param declarationType The type of the returned style declaration.
   * @returns The calculated style declaration.
   */
  public calculateStyle(
    styleSheet: StyleSheet, selectorChain: StyleSelectorChain, declarationType: new () => T
  ): T {
    const result = new declarationType();

    // List of evaluation tasks.
    let taskList: ITaskItem[] = [];

    /* Populate intial task list with all style sheet rules evaluated against every right sided
     * subarray of the selector chain. The smallest chain has the highest priority for all single
     * hierarchy rules and thus comes last in the task list to override the lower prioritized rules
     * that apply. */
    for ( let i = 0; i < selectorChain.chain.length; i += 1 ) {
      taskList.push( { rules: styleSheet.rules, chain: selectorChain.chain.slice( i ) } );
    }

    // Evaluate all tasks and create new tasks for the child rules.
    // Loop termination is guaranteed because the restChain gets shorter with each iteration.
    while ( taskList.length > 0 ) {
      const nextTaskList: ITaskItem[] = [];

      taskList.forEach( ( taskItem: ITaskItem ): void => {
        const topSelector = taskItem.chain[ 0 ];

        taskItem.rules.forEach( ( rule: StyleRule ): void => {
          if ( topSelector.match( rule.selector ) ) {
            // Change the result with the attributes from matching rules.
            result.overrideWith( rule.declaration );

            /* Create the tasks for the child rules evaluated against the tail of the selector
             * chain. */
            const restChain = taskItem.chain.slice( 1 );
            if ( restChain.length > 0 ) {
              nextTaskList.push( { rules: rule.childRules, chain: restChain } );
            }
          }
        } );
      } );

      // Replace old task list with the tasks for the next round.
      taskList = nextTaskList;
    }

    return result;
  }
}
