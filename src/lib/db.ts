import { supabase } from './supabase'
import { Database } from './database.types'

type Subject = Database['public']['Tables']['subjects']['Row']
type Task = Database['public']['Tables']['tasks']['Row']
type Exam = Database['public']['Tables']['exams']['Row']
type Lecture = Database['public']['Tables']['lectures']['Row']

export const db = {
  subjects: {
    async getAll(userId: string) {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
      
      if (error) throw error
      return data
    },

    async create(subject: Omit<Subject, 'id' | 'created_at'>) {
      const { data, error } = await supabase
        .from('subjects')
        .insert(subject)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id: string, subject: Partial<Subject>) {
      const { data, error } = await supabase
        .from('subjects')
        .update(subject)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }
  },

  tasks: {
    async getAll(userId: string) {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true })
      
      if (error) throw error
      return data
    },

    async create(task: Omit<Task, 'id' | 'created_at'>) {
      const { data, error } = await supabase
        .from('tasks')
        .insert(task)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id: string, task: Partial<Task>) {
      const { data, error } = await supabase
        .from('tasks')
        .update(task)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }
  },

  exams: {
    async getAll(userId: string) {
      const { data, error } = await supabase
        .from('exams')
        .select('*')
        .eq('user_id', userId)
        .order('date', { ascending: true })
      
      if (error) throw error
      return data
    },

    async create(exam: Omit<Exam, 'id' | 'created_at'>) {
      const { data, error } = await supabase
        .from('exams')
        .insert(exam)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id: string, exam: Partial<Exam>) {
      const { data, error } = await supabase
        .from('exams')
        .update(exam)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('exams')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }
  },

  lectures: {
    async getAll(userId: string) {
      const { data, error } = await supabase
        .from('lectures')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: true })
      
      if (error) throw error
      return data
    },

    async create(lecture: Omit<Lecture, 'id' | 'created_at'>) {
      const { data, error } = await supabase
        .from('lectures')
        .insert(lecture)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async update(id: string, lecture: Partial<Lecture>) {
      const { data, error } = await supabase
        .from('lectures')
        .update(lecture)
        .eq('id', id)
        .select()
        .single()
      
      if (error) throw error
      return data
    },

    async delete(id: string) {
      const { error } = await supabase
        .from('lectures')
        .delete()
        .eq('id', id)
      
      if (error) throw error
    }
  }
}
