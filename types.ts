export interface UserState {
  name?: string,
  email?: string,
  password?: string,
  createdAt?: Date,
  uid?: number
}

export interface NoteState {
  id: number,
  createdAt: Date,
  updatedAt?: Date,
  encrypted?: string,
  title: string,
  note: string,
  isEdited: boolean,
  authorId: number
}