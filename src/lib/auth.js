import {supabase} from './supabase.js';


export async function signUp (email, password) {
    
    return await supabase.auth.signUp({
    email,
    password,
    options: {},
  });
} 

export async function signIn (email,password) {

    return await supabase.auth.signInWithPassword({
      email,
      password,
    });

}

export async function signOut () {   
    return await supabase.auth.signOut();
}
