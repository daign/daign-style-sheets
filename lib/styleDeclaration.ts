/**
 * Interface describing a style declaration.
 */
export interface IStyleDeclaration {
  /**
   * Override style attributes with values of given style declaration if not equal null.
   * @param declaration The style declaration whose values to use.
   */
  overrideWith( declaration: IStyleDeclaration ): void;
}
