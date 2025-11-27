
//function to create the user in supabase users auth service and recive token
export async function signUpUser(supabaseClient, email, password) {
  try {
    const { data, error } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return {
      user: data.user,
      token: data.session?.access_token || null,
      message: data.session
        ? "User registered successfully"
        : "User registered. Email confirmation required.",
      error: null,
    };
  } catch (err) {
    return {
      user: null,
      token: null,
      message: null,
      error: err.message,
    };
  }
}