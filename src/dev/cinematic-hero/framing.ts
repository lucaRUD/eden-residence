import { heroScenes } from '../../assets/home/renders';

/** Shared art direction for the architectural render and moving footage. */
export const framing = {
  render: heroScenes.arrival,
  ratio: 16 / 9,
  opening: { horizontalAlignment: .44 },
  extraScroll: .95,
} as const;
