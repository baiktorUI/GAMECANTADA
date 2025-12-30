export interface VotingState {
  isActive: boolean;
  hasEnded: boolean;
  votes: {
    blau: number;
    taronja: number;
  };
}

export interface FirebaseVotingState {
  state: {
    isActive: boolean;
    hasEnded: boolean;
    startTime: number | null;
  };
  votes: {
    blau: number;
    taronja: number;
  };
}
