export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      subjects: {
        Row: {
          id: string
          created_at: string
          name: string
          color: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          name: string
          color: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          name?: string
          color?: string
          user_id?: string
        }
      }
      tasks: {
        Row: {
          id: string
          created_at: string
          title: string
          date: string
          time?: string
          duration?: string
          notes?: string
          completed: boolean
          subject_id: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          date: string
          time?: string
          duration?: string
          notes?: string
          completed?: boolean
          subject_id: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          date?: string
          time?: string
          duration?: string
          notes?: string
          completed?: boolean
          subject_id?: string
          user_id?: string
        }
      }
      exams: {
        Row: {
          id: string
          created_at: string
          title: string
          date: string
          time?: string
          notes?: string
          completed: boolean
          subject_id: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          date: string
          time?: string
          notes?: string
          completed?: boolean
          subject_id: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          date?: string
          time?: string
          notes?: string
          completed?: boolean
          subject_id?: string
          user_id?: string
        }
      }
      lectures: {
        Row: {
          id: string
          created_at: string
          title: string
          section: string
          status: string
          notes?: string
          completed: 'not_started' | 'completed' | 'reviewed'
          subject_id: string
          user_id: string
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          section: string
          status: string
          notes?: string
          completed?: 'not_started' | 'completed' | 'reviewed'
          subject_id: string
          user_id: string
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          section?: string
          status?: string
          notes?: string
          completed?: 'not_started' | 'completed' | 'reviewed'
          subject_id?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
