export async function isAuthenticated(Astro) {
    const token = Astro.cookies.get('token')?.value;
    if (!token) {
      return false;
    }
  
    // Opcional: Validar el token con el backend
    try {
      const response = await fetch('http://localhost:3000/v1/users/verify-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
      });
      return response.ok;
    } catch (error) {
      return false;
    }
  }
  