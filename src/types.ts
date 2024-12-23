export interface Vote {
  id: string;
  name: string;
  votes: number;
}

export interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  isEditable: boolean;
}

export interface VotingSession {
  id: string;
  is_active: boolean;
  created_at: string;
}