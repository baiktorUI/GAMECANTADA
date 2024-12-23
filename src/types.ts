export interface Vote {
  id: number;
  name: string;
  votes: number;
}

export interface EditableTextProps {
  value: string;
  onSave: (value: string) => void;
  isEditable: boolean;
}