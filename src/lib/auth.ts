import { supabase } from './supabase';

export async function signUp(email: string, password: string, name: string) {
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name: name,
      },
    },
  });

  if (authError) throw authError;

  return authData;
}

export async function signIn(email: string, password: string, rememberMe: boolean = false) {
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (authError) throw authError;

  if (rememberMe) {
    // Set session expiry to 30 days
    await supabase.auth.updateUser({
      data: { session_expiry: 30 * 24 * 60 * 60 } // 30 days in seconds
    });
  }

  return authData;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function resetPassword(email: string) {
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/auth/reset-password`,
  });
  if (error) throw error;
}

export async function updatePassword(password: string) {
  const { error } = await supabase.auth.updateUser({
    password: password,
  });
  if (error) throw error;
}

export async function updateProfile(data: { name?: string }) {
  const { error } = await supabase.auth.updateUser({
    data: data,
  });
  if (error) throw error;
}
