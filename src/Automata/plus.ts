import Automata from "./Automata";
import star from "./star";
import intersection from "./intersection";

export default function plus(automata: Automata): Automata {
  return intersection(automata, star(automata));
}
