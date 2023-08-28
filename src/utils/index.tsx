// Get the set number from the token data
// Index starts from 1 and 0 means the token is burned.
// Example: 455 which would represent the last set.
export function getSet(tokenData: number): number {
  return tokenData >> 15;
}

// Get the frames from the token data
// Index starts from 0
// Example: [0,4,14] which would represent the frames 1,5 and 15.
export function getFrames(tokenData: number): number[] {
  const frames: number[] = [];

  for (let i = 0; i < 15; i++) {
    if ((tokenData & (1 << i)) > 0) {
      frames.push(i);
    }
  }

  return frames;
}

export function translateFrames(contractFrames: number[]): number[] {
  const frames: number[] = [];

  for (let i = 0; i < contractFrames.length; i++) {
    const frameData = contractFrames[i];
    if (Number(frameData) === 1) {
      frames.push(i);
    }
  }

  return frames;
}

export function translateTrios(
  set: number,
  mappings: Map<number, string> | undefined,
) {
  if (!set || set === 0) return "None";

  if (!mappings || mappings.size === 0) {
    throw new Error("No mapppings provided");
  }

  const setString = set;
  // Get gif name from the set mappings
  const gifName = mappings.get(setString);

  if (!gifName) {
    throw new Error(`No gif name found for set ${setString}`);
  }

  // Get animal names from the gif name
  const animals = gifName.replace(".gif", "").replaceAll("-", ", ");

  return animals;
}
