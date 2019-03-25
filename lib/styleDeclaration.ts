/**
 * Interface describing a style declaration.
 */
export interface IStyleDeclaration {
  /**
   * Returns whether the declaration is empty (all attributes are equal null).
   */
  isEmpty: boolean;

  /**
   * Copy style attributes from given style declaration but don't override already existing values.
   * @param declaration The style declaration whose values to use.
   */
  complementWith( declaration: IStyleDeclaration ): void;
}
