/**
 * Interface describing a style declaration.
 */
export interface IStyleDeclaration {
  /**
   * Returns whether the declaration is empty (all attributes are equal null).
   */
  isEmpty: boolean;

  /**
   * Parse the value of an attribute from string.
   * @param name - The name of the attribute.
   * @param value - The value as a string.
   */
  parseAttribute( name: string, value: string ): void;

  /**
   * Copy style attributes from given style declaration but don't override already existing values.
   * @param declaration - The style declaration whose values to use.
   */
  complementWith( declaration: IStyleDeclaration ): void;


  /**
   * Return the concatenated style declaration as string.
   * @returns The concatenated style declaration as string.
   */
  printStyle(): string;
}
