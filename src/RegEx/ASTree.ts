export default interface ASTree {
  kind: string;
  lexeme?: string;
  children?: Array<ASTree>;
}
